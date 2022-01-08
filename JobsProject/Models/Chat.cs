using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }

        //public int JobId { get; set; }//??
        //[ForeignKey("JobId")]
        //public virtual Job Job { get; set; }

        [NotMapped]
        public virtual List<ChatUser> ChatUser { get; set; } = new List<ChatUser>();
        [NotMapped]
        public virtual List<Message> Messages { get; set; } = new List<Message>();
    }
}
