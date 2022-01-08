using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models
{
    public class Technology
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        [NotMapped]
        public virtual List<JobTechnology> JobTechnology { get; set; } = new List<JobTechnology>();
        [NotMapped]
        public virtual List<TechnologyUser> TechnologyUser { get; set; } = new List<TechnologyUser>();

    }
}
