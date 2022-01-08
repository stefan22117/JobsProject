using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    [NotMapped]
    public class PostJobDto
    {
        public Job Job { get; set; }
        public int[] Technologies { get; set; }
    }
}
