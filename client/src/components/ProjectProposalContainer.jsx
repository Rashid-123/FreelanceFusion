import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProjectProposalContainer = ({ jobDetails }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;
  console.log(jobDetails);
  const handleCheckout = async (proposal, jobId, jobTitle, jobDescription) => {
    try {
      const stripe = await stripePromise;

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/create-checkout-session`,
        {
          clientId: userId,
          jobId,
          jobTitle,
          jobDescription,

          proposal,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const session = response.data;

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (error) {
        console.error("Stripe checkout error:", error.message);
        alert("There was an error redirecting to checkout. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(
        "An error occurred while processing your payment. Please try again."
      );
    }
  };

  return (
    <div className="project_proposal_container">
      {jobDetails.proposals.length > 0 ? (
        jobDetails.proposals.map((item) => (
          <div key={item._id} className="proposal">
            <p>{item.proposalText}</p>
            <p>{item.budget}</p>
            <p>{item.duration}</p>
            <button
              onClick={() =>
                handleCheckout(
                  item,
                  jobDetails._id,
                  jobDetails.title,
                  jobDetails.description
                )
              }
            >
              {item.status}
            </button>
            <p>{formatDate(item.createdAt)}</p>
          </div>
        ))
      ) : (
        <p>No proposals available</p>
      )}
    </div>
  );
};

ProjectProposalContainer.propTypes = {
  jobDetails: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    proposals: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        proposalText: PropTypes.string.isRequired,
        budget: PropTypes.number.isRequired,
        duration: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ProjectProposalContainer;
