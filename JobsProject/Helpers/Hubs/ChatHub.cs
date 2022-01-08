using JobsProject.Helpers.Hubs.Clients;
using JobsProject.Models;
using JobsProject.Models.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Helpers.Hubs
{
    public class ChatHub : Hub
    {
        private IDictionary<string, UserConnection> _connections { get; set; }
        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _connections = connections;
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            _connections.Remove(Context.ConnectionId);

            return base.OnDisconnectedAsync(exception);
        }



        public async Task GetIntoInbox(UserConnection userConnection)
        {
            if (userConnection.UserId != 0)
            {
            _connections.Add(Context.ConnectionId, userConnection);

            }
        }
    }
}
