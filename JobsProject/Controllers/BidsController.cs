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
    public class BidsController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public BidsController(JobsDbContext _context)
        {
            context = _context;
        }
        // GET: api/<BidsController>
        [HttpGet]
        public async Task<IEnumerable<Bid>> Get()
        {
            return await context.Bids
                .Include(x => x.Job.Valute)
                .ToArrayAsync();
        }

        // GET api/<BidsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bid>> Get(int id)
        {
            Bid bid = await context.Bids
                .Include(x => x.Job.Valute)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (bid != null)
            {
                return bid;
            }
            else
            {
                return NotFound();
            }
        }

        // GET api/<BidsController>/jobId/:jobId/
        [HttpGet("jobId/{jobId}")]
        public async Task<ActionResult> GetByJobAndUser(string jobId)
        {
            List<Bid> bids = await context.Bids
                .Include(x=>x.User)
                .Where(x => x.JobId == int.Parse(jobId))
                .ToListAsync();

            return Ok(bids);

        }


        // GET api/<BidsController>/:jobId/:userId
        [HttpGet("{jobId}/{userId}")]
        public async Task<ActionResult> GetByJobAndUser(string jobId, string userId)
        {
            Bid bid = await context.Bids
                .Where(x => x.JobId == int.Parse(jobId))
                .Where(x => x.UserId == int.Parse(userId))
                .FirstOrDefaultAsync();

            if (bid == null)
            {
                return Ok(new { });
            }
            return Ok(bid);

        }

        // POST api/<BidsController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Bid bid)
        {
            bid.CreatedDateTime = DateTime.Now;
            bid.Accepted = false;
            if (ModelState.IsValid)
            {
                await context.Bids.AddAsync(bid);
                await context.SaveChangesAsync();
                return Ok(bid);
            }
            else
            {
                return BadRequest();
            }
        }

        // PUT api/<BidsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BidsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Bid bid = context.Bids.FirstOrDefault(x => x.Id == id);
            context.Bids.Remove(bid);

            context.SaveChanges();
        }
    }
}
