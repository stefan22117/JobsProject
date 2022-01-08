using JobsProject.Models;
using JobsProject.Models.Dtos;
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
    public class JobsController : ControllerBase
    {
        public JobsDbContext context { get; set; }
        public JobsController(JobsDbContext _context)
        {
            context = _context;
        }
        // GET: api/<JobsController>
        [HttpGet]
        public async Task<IEnumerable<Job>> Get()
        {
            List<Job> list = await context.Jobs
                //.Include(x => x.JobTechnology)
                .Include(x => x.Valute)
                .Where(x=>x.Finished == false)//??
                .ToListAsync();

            List <JobTechnologiesDto> listaa = new List<JobTechnologiesDto>();

            list.ForEach(job =>
            {
                List<Bid> bids = context.Bids
                       .Where(b => b.JobId == job.Id)
                       .ToList();

                bids.ForEach(b =>
                {
                    //b.Job.Bids = null;
                    b.Job = null;
                });

                job.Bids = bids;


                //var technologyIds = context.JobTechnology
                //.Where(x=>x.JobId == job.Id)
                //.Select(x => x.TechnologyId);

                //List<Technology> technologies = context.Technologies
                //.Where(x => technologyIds.Contains(x.Id))
                //.ToList();


                //listaa.Add(new JobTechnologiesDto() {
                //Job = job,
                //Technologies = technologies
                //}
                //    );
                

            });

            return list.OrderByDescending(x=>x.CreatedDateTime);
        }

        [HttpGet("userPosted/{id}")]
        public async Task<IEnumerable<Job>> GetUserPosted(int id)
        {
            List<Job> list = await context.Jobs
                .Include(x => x.Valute)
                .Where(x=>x.UserId == id)
                .ToListAsync();

            list.ForEach(job =>
            {
                List<Bid> bids = context.Bids
                       .Where(b => b.JobId == job.Id)
                       .ToList();

                bids.ForEach(b =>
                {
                    //b.Job.Bids = null;
                    b.Job = null;
                });

                job.Bids = bids;

            });

            return list.OrderByDescending(x => x.CreatedDateTime);
        }

        [HttpGet("userBidded/{id}")]
        public async Task<IEnumerable<Job>> GetUserBidded(int id)
        {
            var jobIds = context.Bids.Where(x => x.UserId == id).Select(x => x.JobId).ToList();

            List<Job> list = await context.Jobs
                .Include(x => x.Valute)
                .Where(x => jobIds.Contains(x.Id))
                .ToListAsync();


            list.ForEach(job =>
            {
                List<Bid> bids = context.Bids
                       .Where(b => b.JobId == job.Id)
                       .ToList();

                bids.ForEach(b =>
                {
                    //b.Job.Bids = null;
                    b.Job = null;
                });

                job.Bids = bids;

            });

            return list.OrderByDescending(x => x.CreatedDateTime);
        }
        
        [HttpGet("userFinished/{id}")]
        public async Task<IEnumerable<Job>> GetUserFinished(int id)
        {
            var jobIds = context.Bids
               .Where(x => x.UserId == id)
               .Where(x => x.Accepted == true)
               .Select(x => x.JobId).ToList();

            List<Job> list = await context.Jobs
                .Include(x => x.Valute)
                .Where(x => jobIds.Contains(x.Id))
                .Where(x => x.Finished == true)
                .ToListAsync();


            list.ForEach(job =>
            {
                List<Bid> bids = context.Bids
                       .Where(b => b.JobId == job.Id)
                       .ToList();

                bids.ForEach(b =>
                {
                    //b.Job.Bids = null;
                    b.Job = null;
                });

                job.Bids = bids;

            });

            return list.OrderByDescending(x => x.CreatedDateTime);
        }


        // GET api/<JobsController>/byCompletedJob/5
        [HttpGet("byCompletedJob/{id}")]
        public async Task<ActionResult> GetByCompletedJob(int id)
        {
            Job job = await context.Jobs
                .Include(x=>x.Valute)
                .FirstOrDefaultAsync(x => x.Id == id);
            Bid bid = await context.Bids.FirstOrDefaultAsync(x => x.JobId == id && x.Accepted == true);
            if (job == null || bid == null)
            {
                return BadRequest();
            }
            User user = await context.Users
                .Include(x => x.Valute)
                .FirstOrDefaultAsync(x => x.Id == bid.UserId);
            if (user == null)
            {
                return BadRequest();
            }


            return Ok(new PayFreelancerDto()
            {
                User = user,
                ActiveBid = bid,
                Job = job
            });

        }
        // GET api/<JobsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> Get(int id)
        {
            Job job = await context.Jobs
                .Include(x => x.Valute)
                
                .FirstOrDefaultAsync(x => x.Id == id);



            if (job != null)
            {

                return job;
            }
            else
            {
                return NotFound();
            }
        }
        // post api/<JobsController>/completeJob/5

        // POST api/<JobsController>/search
        [HttpPost("search")]
        public ActionResult PostSearch([FromBody] SearchDto search)
        {
            IQueryable<Job> jobs = context.Jobs.Include(x => x.JobTechnology).Where(x => x.Finished == false);
            if (search.Word != null && search.Word != string.Empty)
            {
                jobs = jobs.Where(x => x.Title.ToLower().Contains(search.Word.ToLower())
                ||
                x.Description.ToLower().Contains(search.Word.ToLower())
                );
            }
            if(search.NotReserved == true)
            {
                jobs = jobs.Where(x => x.Reserved == false);
            }


            if (search.Technologies != null && search?.Technologies.Count > 0)
            {
                jobs = jobs.AsEnumerable<Job>().Where(job => 
                search.Technologies.AsEnumerable<int>().All(jt =>
                job.JobTechnology.Select(x => x.TechnologyId).Contains(jt))
                ).AsQueryable<Job>();

            }


            return Ok(jobs.OrderByDescending(x => x.CreatedDateTime));
        }


        [HttpPost("completeJob/{id}")]
        public async Task<ActionResult> CompletedJob(int id)
        {

            
            Job job = await context.Jobs
                .Include(x => x.Valute)
                .FirstOrDefaultAsync(x => x.Id == id);
            Bid bid = await context.Bids
                .FirstOrDefaultAsync(x => x.JobId == id && x.Accepted == true);
            if (job == null || bid == null)
            {
                return BadRequest();
            }
            User user = await context.Users
                .Include(x => x.Valute)
                .FirstOrDefaultAsync(x => x.Id == bid.UserId); 
            
            User userPostedJob = await context.Users
                .Include(x => x.Valute)
                .FirstOrDefaultAsync(x => x.Id == job.UserId);

            if (user == null)
            {
                return BadRequest();
            }


            job.Finished = true;


            double amountInDinars = bid.Amount / job.Valute.ToDinars;

            userPostedJob.Total = userPostedJob.Total - amountInDinars;


            context.Jobs.Update(job);
            context.Users.Update(userPostedJob);
            await context.SaveChangesAsync();


            return Ok(new PayFreelancerDto()
            {
                User = user,
                ActiveBid = bid,
                Job = job
            });

        }
        // POST api/<JobsController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PostJobDto jobDto)
        {
            Job job = jobDto.Job;
            job.Finished = false;
            job.CreatedDateTime = job.UpdatedtedDateTime = DateTime.Now;
            if (ModelState.IsValid)
            {
                await context.Jobs.AddAsync(job);

                await context.SaveChangesAsync();

                

                var techs = context.Technologies
                .Where(x => jobDto.Technologies.Contains(x.Id))
                .Select(x => new JobTechnology
                {
                    JobId = job.Id,
                    TechnologyId = x.Id
                }).ToList();

                context.JobTechnology.AddRange(techs);
                await context.SaveChangesAsync();
                return Ok(job);
            }
            else
            {
                return BadRequest();
            }
        }



        // PUT api/<JobsController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PostJobDto jobDto)
        {
            Job job = jobDto.Job;
            if(id != job.Id)
            {
                return NotFound();
            }

            var techs = await context.Technologies
                .Where(x => jobDto.Technologies.Contains(x.Id))
                .ToListAsync();

            job.UpdatedtedDateTime = DateTime.Now;
            if (ModelState.IsValid)
            {
                try
                {
                context.JobTechnology.RemoveRange(context.JobTechnology.Where(x=>x.JobId == id));
                context.SaveChanges();

                context.JobTechnology.AddRange(techs.Select(x=> new JobTechnology { 
                    JobId = id,
                    TechnologyId=x.Id
                    
                }));
                context.SaveChanges();
                }
                catch(Exception e)
                {
                }

                try
                {
                context.Jobs.Update(job);
                await context.SaveChangesAsync();

                }
                catch(Exception e)
                {
                }

                return Ok(job);
            }
            else
            {
                return BadRequest();
            }

        }
    }
}
