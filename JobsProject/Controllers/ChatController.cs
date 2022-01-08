using JobsProject.Helpers;
using JobsProject.Helpers.Hubs;
using JobsProject.Helpers.Hubs.Clients;
using JobsProject.Models;
using JobsProject.Models.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> chatHub;
        private readonly JobsDbContext context;
        private IDictionary<string, UserConnection> _connections { get; set; }

        public ChatController(IHubContext<ChatHub> _chatHub, JobsDbContext _context,
            IDictionary<string, UserConnection> connections
            )
        {
            _connections = connections;
            chatHub = _chatHub;
            context = _context;
        }
       
       


        [HttpPost("sendMessage")]
        public async Task SendMessage([FromForm] SendMessageDto sendMessageDto)
        {
           var sender = context.Users.FirstOrDefault(x => x.Id == sendMessageDto.SenderId);
            sendMessageDto.Sender = sender;
            
            var receiver = context.Users.FirstOrDefault(x => x.Id == sendMessageDto.ReceiverId);
            sendMessageDto.Receiver = receiver;




            var chatSenders = context.ChatUser.Where(x => x.UserId == sender.Id);
            var chatReceivers = context.ChatUser.Where(x => x.UserId == receiver.Id);

            Chat chat = null;
            if (chatReceivers.Count() > 0 && chatSenders.Count() > 0)
            {
                foreach (var rec in chatReceivers)
                {
                    if (chatSenders.Any(x => x.ChatId == rec.ChatId))
                        //chatR i chatS vec postoje
                    {
                        chat = await context.Chats.FirstOrDefaultAsync(c => c.Id == rec.ChatId);
                        break;
                    }
                }
            }
            if (chat == null)
            {
                var _chat = new Chat();
                context.Chats.Add(_chat);
                await context.SaveChangesAsync();
                chat = _chat;


                var chatR = new ChatUser()
                {
                    UserId = receiver.Id,
                    ChatId = chat.Id
                };

                var chatS = new ChatUser()
                {
                    UserId = sender.Id,
                    ChatId = chat.Id
                };
                context.ChatUser.AddRange(new List<ChatUser>() { chatR, chatS });

                context.SaveChanges();

            }


            if (sendMessageDto.Type == "img")
            {
                if (sendMessageDto.Images == null)
                {
                    sendMessageDto.Images = new List<IFormFile>();
                }
                //upload image
                if (sendMessageDto.Images.Count > 0)
                {
                    List<Message> images = new List<Message>();
                    //update avatar
                    int index = 0;
                    foreach (var img in sendMessageDto.Images)
                    {
                    string ext = Path.GetExtension(img.FileName);
                    string name = sendMessageDto.SenderId.ToString() + "-"
                            + sendMessageDto.ReceiverId.ToString() + "-"
                            + (index++).ToString() + "-"
                            + DateTime.Now.Ticks
                            + ext;

                        images.Add(
                            new Message()
                            {
                                UserId = sender.Id,
                                Text = name,
                                Type = "img",
                                ChatId = chat.Id,
                                Seen = false
                            }
                            );
                    string path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/public/media/messageImages", name);
                        using (Stream stream = new FileStream(path, FileMode.Create))
                        {
                            img.CopyTo(stream);
                        }
                    }



                    context.Messages.AddRange(images);


                }

            }
            else if (sendMessageDto.Type == "text")
            {
                Message message = new Message()
                {
                    UserId = sender.Id,
                    Text = sendMessageDto.Text,
                    Type="text",
                    ChatId = chat.Id,
                    Seen = false
                };
                context.Messages.Add(message);
            }
            else
            {
                return;
            }

            
            context.SaveChanges();

            var re = _connections
                .Where(x => x.Value.UserId == sendMessageDto.ReceiverId ||
                 x.Value.UserId == sendMessageDto.SenderId)
                .Select(x=>x.Key);
            if(re.Count() > 0)
            {
                await chatHub.Clients.Clients(re).SendAsync("ReceiveMessage", sendMessageDto);
                //await chatHub.Clients.All.SendAsync("ReceiveMessage", sendMessageDto);
            }

        }

        [HttpGet("getUnreadNumber/{id}")]
        public async Task<List<UnreadMessageDto>> GetUnreadNumber(int id)
        {
            var listOfChatUsers = context.ChatUser.Where(x => x.UserId == id).Select(x=>x.ChatId);

            var listOfChats = context.Chats.Where(x => listOfChatUsers.Contains(x.Id)).Select(x=> x.Id);

            var listToReturn = new List<UnreadMessageDto>();

            foreach (var chat in listOfChats)
            {
                var poruke1 = context.Messages
                .Where(x => x.ChatId == chat)
                .Where(x => x.UserId != id)
                .Where(x => x.Seen == false)
                .ToList()
                ;
                if (poruke1.Count > 0)
                {


                    listToReturn.Add(new UnreadMessageDto()
                    {
                        UserId = poruke1.FirstOrDefault().UserId,
                        Number = poruke1.Count,

                    });
                
                }
    
            }
            return listToReturn;
        }

        [HttpGet("seenMessages/{id}")]
        public async Task SeenMessages(int id)
        {
            var messagesForUpdate = context.Messages.Where(m=>m.UserId == id);
            foreach (var message in messagesForUpdate)
            {
                message.Seen = true;
                context.Messages.Update(message);
            }
               await context.SaveChangesAsync();
        }

        [HttpGet("getMessages/{id1}/{id2}")]
        public async Task<List<SendMessageDto>> GetMessages(int id1, int id2)
        {

            var chatUsers = context.ChatUser.Where(x => x.UserId == id1);

            Chat chat = null;
            if (chatUsers.Count() > 0)
            {
                foreach (var cu in chatUsers)
                {
                    if (context.ChatUser.Any(x => cu.Id != x.Id && x.ChatId == cu.ChatId && x.UserId == id2))
            
                    {
                        chat = await context.Chats.FirstOrDefaultAsync(c => c.Id == cu.ChatId);
                        break;
                    }
                }
            }

            if (chat == null)
            {
                return new List<SendMessageDto>();
            }
            else
            {
                List<SendMessageDto> listToReturn = new List<SendMessageDto>();
                var list = context.Messages.Where(x => x.ChatId == chat.Id).ToList();


                foreach (var m in list)
                {
                    var receiverCU = context.ChatUser.FirstOrDefault(x => x.ChatId == chat.Id && x.UserId != m.UserId);
                    var receiver = context.Users.FirstOrDefault(x => x.Id == receiverCU.UserId);
                    SendMessageDto sendMessageDto = new SendMessageDto()
                    {
                        Text = m.Text,
                        ReceiverId = receiver?.Id,
                        Receiver = receiver,
                        SenderId = m.UserId,
                        Sender = context.Users.FirstOrDefault(x => x.Id == m.UserId),
                        Seen = m.Seen,
                        Type = m.Type
                    };

                    listToReturn.Add(sendMessageDto);
                }
                return listToReturn;
            }

        }



    }
}
