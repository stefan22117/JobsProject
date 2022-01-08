using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    [NotMapped]
    public class SendMessageDto
    {
        public int SenderId { get; set; }
        public User Sender { get; set; }
        public int? ReceiverId { get; set; }
        public User Receiver { get; set; }
        public int? ChatId { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public List<IFormFile> Images { get; set; }
        public bool Seen { get; set; }



    }
}
