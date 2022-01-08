using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class ChatUser
    {
        [Key]
        public int Id { get; set; }
        public int ChatId { get; set; }
        [NotMapped]
        public virtual List<Chat> Chats { get; set; } = new List<Chat>();
        public int UserId { get; set; }
        [NotMapped]
        public virtual List<User> Users { get; set; } = new List<User>();
    }
}
