using JobsProject.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Helpers.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(SendMessageDto sendMessageDto);
        Task KKK();

    }
}
