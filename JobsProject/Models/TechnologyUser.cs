using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class TechnologyUser
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [NotMapped]
        public virtual List<User> Users { get; set; } = new List<User>();
        public int TechnologyId { get; set; }
        [NotMapped]
        public virtual List<Technology> Technologies { get; set; } = new List<Technology>();
    }
}
