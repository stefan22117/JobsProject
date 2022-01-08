using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        public bool Seen { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public string Text { get; set; }
        public string Type { get; set; }

        public int? ChatId { get; set; }
        [ForeignKey("ChatId")]
        public virtual Chat Chat { get; set; }

        
    }
}
