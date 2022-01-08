import { Button, Grid } from '@material-ui/core'
import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { useParams,useHistory } from 'react-router';
import * as jobActions from "../redux/actions/jobActions";
import * as userActions from "../redux/actions/userActions";
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
const FreelancerPayment = ({loggedUser,bidFreelancerJob, ...props}) => {
    const history = useHistory();
    const params = useParams();
    useEffect(() => {
        props.getBidFreelancerJob(params.id)
    }, []);
    const total = bidFreelancerJob?.activeBid?.amount / bidFreelancerJob?.job?.valute?.toDinars;
 

    const formatTotal = (total, decimals=2)=>{
        return (total+"").indexOf(".") != -1?
        (total+"").slice(
          0,(total+"").indexOf(".")+decimals+1
          ):
        total;
    }

    const payFreelancerHandler = async () =>{

        if(bidFreelancerJob?.job?.finished){
            return toast("You have already paid a freelancer for this job");
        }

        if(loggedUser.total- total<0){
           return toast("You need: "+ formatTotal(total - loggedUser.total) +" " +loggedUser?.valute?.namePlural.toLowerCase() + " more")
        }
            await props.completeJob(params.id);
            toast("You paid the user " + bidFreelancerJob.user.name+" " +formatTotal(total)+ loggedUser?.valute?.namePlural.toLowerCase());
            history.push('/jobs/'+params.id);
            await props.getLoggedUser();
        
    }
    return (
        <div>
            <h1>{bidFreelancerJob?.job?.title}</h1>
            <Grid container>
                <Grid item md={4}>
                <p>Your balance: {loggedUser.total}{loggedUser?.valute?.label}</p>
                </Grid>
                <Grid item md={4}>
                    <p>Payment: {bidFreelancerJob?.job?.paymentType}</p>
                    <p>Price: {bidFreelancerJob?.activeBid?.amount} {bidFreelancerJob?.job?.valute?.label}</p>
                  {
                     loggedUser?.valute?.id != bidFreelancerJob?.job?.valute?.id &&
                     
                     <p>Converted: -{ 
                        formatTotal(total)
                        } {loggedUser?.valute?.label} </p>
                  }

<p>Your Bilance: { 
                        (loggedUser.total- total+"").indexOf(".") != -1?
                        (loggedUser.total- total+"").slice(
                          0,(loggedUser.total - total+"").indexOf(".")+3
                          ):
                          loggedUser.total- total
                        } {loggedUser?.valute?.label} </p>



                </Grid>
                <Grid item md={4}>
                    <Link to={"/freelancers/"+bidFreelancerJob?.user?.id}>{bidFreelancerJob?.user?.name}</Link>
                <Button
                 variant='contained'
                  color='primary' 
                  disabled={bidFreelancerJob?.job?.finished}
                  onClick={()=>payFreelancerHandler(bidFreelancerJob?.job?.id)}>Pay</Button>
                </Grid>

            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => ({
    loggedUser: state.usersReducer.user,
    technologiesList: state.technologiesReducer.technologiesByJobId,
    bidsList: state.bidsReducer.list,
    bidFreelancerJob: state.jobsReducer.singleJob,
  });
  
  const mapDispatchToProps = {
    getSingleJob: jobActions.findById,
    getBidFreelancerJob: jobActions.findByCompletedJobId,
    completeJob: jobActions.completeJob,
    getLoggedUser: userActions.getLoggedUser,
    // technologiesByJobId: technologyActions.fetchByJobId,
    // bidsByJobId: bidActions.fetchByJobId,
  };
  export default connect(mapStateToProps, mapDispatchToProps)(FreelancerPayment);

