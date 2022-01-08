using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobsProject.Models.Dtos
{
    public class SearchDto
    {
        public string Word { get; set; }
        public bool? NotReserved { get; set; }
        public List<int> Technologies { get; set; }
    }
}
