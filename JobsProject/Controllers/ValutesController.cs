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
    public class ValutesController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public ValutesController(JobsDbContext _context)
        {
            context = _context;
            SeedData.Valutes(context);
        }
        // GET: api/<ValuesController>
        [HttpGet]
        public async Task<IEnumerable<Valute>> Get()
        {
            return await context.Valutes.ToListAsync();
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            Valute valute = context.Valutes.FirstOrDefault(x => x.Id == id);
            if(valute == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(valute);
            }
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<Valute>> Post([FromBody] Valute valute)
        {
            if (ModelState.IsValid)
            {
               await context.Valutes.AddAsync(valute);
               await context.SaveChangesAsync();
            return valute;
            }
            else
            {
                return BadRequest();
            }
        }


    }
}
