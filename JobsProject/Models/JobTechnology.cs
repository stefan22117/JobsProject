using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class JobTechnology
    {
        [Key]
        public int Id { get; set; }
        public int JobId { get; set; }
        [NotMapped]
        public virtual List<Job> Jobs { get; set; } = new List<Job>();
        public int TechnologyId { get; set; }
        [NotMapped]
        public virtual List<Technology> Technologies { get; set; } = new List<Technology>();
    }
}
