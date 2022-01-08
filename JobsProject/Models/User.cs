using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool EmailVerifyRequested { get; set; }
        public bool EmailVerified { get; set; }
        public double Total { get; set; }
        public string Avatar { get; set; }
        public string Role { get; set; }
        
        public string Description { get; set; }
        public int? ValuteId { get; set; }
        [ForeignKey("ValuteId")]
        public virtual Valute Valute { get; set; }

        [JsonIgnore]
        public string Password { get; set; }

        [NotMapped]
        public virtual List<Job> Jobs { get; set; } = new List<Job>();

        [NotMapped]
        public virtual List<Bid> Bids { get; set; } = new List<Bid>();

        public virtual List<TechnologyUser> TechnologyUser { get; set; } = new List<TechnologyUser>();
        [NotMapped]
        public virtual List<Message> Messages { get; set; } = new List<Message>();
    }
}
