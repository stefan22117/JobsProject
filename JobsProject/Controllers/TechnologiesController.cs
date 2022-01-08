using JobsProject.Helpers;
using JobsProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JobsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnologiesController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public TechnologiesController(JobsDbContext _context)
        {
            context = _context;
            SeedData.Technologies(context);
        }
        // GET: api/<TechnologiesController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await context.Technologies.ToListAsync());
        }

        // GET api/<TechnologiesController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            Technology technology = await context.Technologies.FirstOrDefaultAsync(x=>x.Id == id);

            if(technology == null)
            {
                return NotFound();
            }

            return Ok(technology);
        }

        
        [HttpGet("byJobId/{id}")]
        public async Task<IEnumerable<Technology>> GetByJobId(int id)
        {
            var techs = await context.JobTechnology.Where(x => x.JobId == id)
                .Select(x=>x.TechnologyId)
                .ToListAsync();

            return await context.Technologies
                .Where(x => techs.Contains(x.Id))
                .ToListAsync();
            
        }

        [HttpGet("byFreelancerId/{id}")]
        public async Task<IEnumerable<Technology>> GetByFreelancerId(int id)
        {
            var techs = await context.TechnologyUser.Where(x => x.UserId == id)
                .Select(x => x.TechnologyId)
                .ToListAsync();

            return await context.Technologies
                .Where(x => techs.Contains(x.Id))
                .ToListAsync();

        }    
        [HttpPost("updateTechForUser")]
        public async Task<IEnumerable<Technology>> AttachTechToUser(int userId, int techId)
        {

            //doraditi
            var techs = await context.TechnologyUser.Where(x => x.UserId == userId)
                .Select(x => x.TechnologyId)
                .ToListAsync();

            return await context.Technologies
                .Where(x => techs.Contains(x.Id))
                .ToListAsync();

        }


        // POST api/<TechnologiesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Technology technology)
        {

            if (ModelState.IsValid)
            {
                await context.Technologies.AddAsync(technology);
                await context.SaveChangesAsync();
                return Ok(technology);
            }
            else
            {
                return BadRequest();
            }

        }
    }
}
