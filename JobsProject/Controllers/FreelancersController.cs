using FluentEmail.Core;
using FluentEmail.Razor;
using FluentEmail.Smtp;
using JobsProject.Helpers;
using JobsProject.Models;
using JobsProject.Models.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JobsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FreelancersController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public FreelancersController(JobsDbContext _context)
        {
            context = _context;
        }
        // GET: api/<FreelancersController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            return Ok(await context.Users.ToListAsync());
        }

        // GET api/<FreelancersController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            User user = await context.Users
                   .FirstOrDefaultAsync(x => x.Id == id);

            if (user != null)
            {

                return Ok(user);
            }
            else
            {
                return NotFound();
            }
        }

        // GET api/<FreelancersController>/forInbox/5
        [HttpGet("forInbox/{id}")]
        public async Task<ActionResult> GetForInbox(int id)
        {
            User user = await context.Users
                   .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                return NotFound();
            }
            var chatUsers = context.ChatUser.Where(x => x.UserId == id).Select(x=>x.ChatId);


            var chats = context.Chats.Where(x => chatUsers.Contains(x.Id)).Select(x => x.Id);


            var anotherChatUsers = context.ChatUser
                .Where(x => x.UserId != id)
                .Where(x => chats.Contains(x.ChatId))
                .Select(x=>x.UserId);


            var bidsOfUser = context.Bids
                .Where(x=>x.Accepted == true)
                .Where(x => x.UserId == id)
                .Select(x => x.Job.UserId);

            var jobsOfUser = context.Bids.Where(x => x.Job.UserId == id)
                .Select(x => x.UserId);


            var users = context.Users
                .Where(x=> 
                x.Id != id &&
                anotherChatUsers.Contains(x.Id)
                || bidsOfUser.Contains(x.Id)
                || jobsOfUser.Contains(x.Id)
                )
                .ToList();

            return Ok(users);
            
        }



        // POST api/<FreelancersController>/search
        [HttpPost("search")]
        public ActionResult PostSearch([FromBody] SearchDto search)
        {
            IQueryable<User> freelancers = context.Users.Include(x=>x.TechnologyUser);
            if (search.Word != null && search.Word != string.Empty)
            {
                freelancers = freelancers.Where(x => x.Name.ToLower().Contains(search.Word.ToLower()));
            }
            if (search.Technologies != null && search?.Technologies.Count > 0)
            {
                var listOfTechUser = context.TechnologyUser.Where(x => search.Technologies.Contains(x.TechnologyId)).Select(x => x.UserId);
                freelancers = freelancers.Where(x => listOfTechUser.Contains(x.Id));
            }

            if (search.Technologies != null && search?.Technologies.Count > 0)
            {
                freelancers = freelancers.AsEnumerable<User>().Where(user =>
                search.Technologies.AsEnumerable<int>().All(jt =>
                user.TechnologyUser.Select(x => x.TechnologyId).Contains(jt))
                ).AsQueryable<User>();

            }


            return Ok(freelancers);
        }
        // POST api/<FreelancersController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // POST api/<FreelancersController>/emailVerifyRequset
        
        [HttpPost("emailVerifyRequset")]
        public async Task<ActionResult> EmailVerifyRequset()
        {
            try
            {
                string jwt = Request.Cookies["jwt"];

                JwtSecurityToken token = JwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                User user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);

                if (user == null)
                {
                    return NotFound();
                }

                user.EmailVerifyRequested = true;
                context.Update(user);
                context.SaveChanges();


                //send email

                var sender = new SmtpSender(() => new SmtpClient("smtp.gmail.com", 587)
                {
                    UseDefaultCredentials = false,
                    EnableSsl= true,
                    Credentials = new System.Net.NetworkCredential()
                    {
                        UserName = "mail@gmail.com",
                        Password = "password"
                    },
                    //DeliveryMethod =SmtpDeliveryMethod.SpecifiedPickupDirectory,
                    //PickupDirectoryLocation = Path.Combine(Directory.GetCurrentDirectory(), "Emails")
                });

                string requestUrl = $"{Request.Scheme}://{Request.Host.Value}";




                Email.DefaultSender = sender;
                Email.DefaultRenderer = new RazorRenderer();

                StringBuilder builder = new StringBuilder();

                string link = $"<a style='padding:5px;text-decoration:none;color:#adefd1;background-color:#00203f;border-radius:5px;' href='{requestUrl}/verifyEmail/{jwt}' target='_blank'>here</a>";

                builder.AppendLine("<div style='padding:10px;color:#00203f;background-color:#adefd1;border-radius:5px;'>");
                builder.AppendLine("<h3>Hello, @Model.Name </h3>");
                builder.AppendLine("<p>To verify your email, please click ");


                //builder.AppendLine("<button type='button' style='color:#adefd1;background-color:#00203f;border-radius:5px;'>here</button>");



                builder.AppendLine(link);

                builder.AppendLine("</p>");
                builder.AppendLine("</div>");


                var a = builder.ToString();
                try
                {
                    var email = await Email.From("emailbot@jobs.com")
                      .To(user.Email)
                      .Subject("no-replay")
                      .UsingTemplate(builder.ToString(), new { Name = user.Name })
                      .SendAsync();
                }
                catch(Exception e)
                {
                    return BadRequest();
                }

                return Ok();
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }
        // POST api/<FreelancersController>/emailVerify
        [HttpPost("emailVerify/{jwt}")]
        public async Task<ActionResult> EmailVerify(string jwt)
        {
            try
            {
                JwtSecurityToken token = JwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);

                User user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);

                if (user == null)
                {
                    return NotFound();
                }


                try
                {
                    if(user.EmailVerifyRequested == false)
                    {
                    return BadRequest();
                    }
                    user.EmailVerifyRequested = true;
                    user.EmailVerified = true;
                    context.Update(user);
                    context.SaveChanges();
                    return Ok();
                }
                catch(Exception e)
                {
                    return BadRequest();
                }
                
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpPost("hireFreelancer/{jobId}/{userId}")]
        public async Task<ActionResult> HireFreelancer(int jobId, int userId)
        {
            Job job = await context.Jobs.FirstOrDefaultAsync(x => x.Id == jobId);
            User user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            Bid bid = await context.Bids.FirstOrDefaultAsync(x => x.JobId == jobId && x.UserId == userId);
            
            if(job == null || user == null || bid == null)
            {
                return NotFound();
            }

            job.Reserved = true;
            bid.Accepted = true;

            context.Jobs.Update(job);

            await context.SaveChangesAsync();
            return Ok();
        }
        

        // PUT api/<FreelancersController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromForm] FreelancerDto freelancerDto)
        {
           
            if (id != freelancerDto.Id)
            {
                return NotFound();
            }

            User oldUser = await context.Users
                .AsNoTracking<User>()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (freelancerDto.Password1 != null 
                && freelancerDto.Password1 != string.Empty 
                && freelancerDto.Password1== freelancerDto.Password2)
            {
                oldUser.Password = BCrypt.Net.BCrypt.HashPassword(freelancerDto.Password1);
            }

            if(oldUser.Email != freelancerDto.Email)
            {

                oldUser.Email = freelancerDto.Email;

                oldUser.EmailVerifyRequested = false;
                oldUser.EmailVerified = false;
            }

            oldUser.ValuteId = freelancerDto.ValuteId;

            if (freelancerDto.Technologies == null)
            {
                freelancerDto.Technologies = new int[0];
            }

            var techs = await context.Technologies
                .Where(x => freelancerDto.Technologies.Contains(x.Id))
                .ToListAsync();

            if (ModelState.IsValid)
            {
                try
                {
                    context.TechnologyUser.RemoveRange(context.TechnologyUser.Where(x => x.UserId == id));
                    context.SaveChanges();

                    context.TechnologyUser.AddRange(techs.Select(x => new TechnologyUser
                    {
                        UserId = id,
                        TechnologyId = x.Id

                    }));
                    context.SaveChanges();
                }
                catch (Exception e)
                {
                return BadRequest(new {message = e.Message });
                }

                try
                {
                    oldUser.Name = freelancerDto.Name;
                    oldUser.ValuteId = freelancerDto.ValuteId;
                    oldUser.Description = freelancerDto.Description;
                    if (freelancerDto.NewAvatar != null)
                    {
                        string ext = Path.GetExtension(freelancerDto.NewAvatar.FileName);

                        string name = "avatar-" + freelancerDto.Id.ToString() + ext;

                        oldUser.Avatar = name;
                        string path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp/public/media/freelancerAvatar", name);

                        using (Stream stream = new FileStream(path, FileMode.Create))
                        {
                            freelancerDto.NewAvatar.CopyTo(stream);
                        }

                    }


                    context.Users
                        .Update(oldUser);
                    await context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return BadRequest(new { message = e.Message });
                }
                


                return Ok(oldUser);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
