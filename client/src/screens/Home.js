import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Vote from "./Vote";
import Admin from "./Admin";
import ElectionContract from "../contracts/Election.json";
import getWeb3 from "../utils/getWeb3";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeWeb3 = async () => {
    try {
      // Get web3 and accounts
      const web3Instance = await getWeb3();
      const accounts = await web3Instance.eth.getAccounts();
      const networkId = await web3Instance.eth.net.getId();
      
      // Get contract instance
      const deployedNetwork = ElectionContract.networks[networkId];
      const contractInstance = new web3Instance.eth.Contract(
        ElectionContract.abi,
        deployedNetwork.address
      );

      // Set states
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setContract(contractInstance);

      // Check roles
      const adminStatus = await contractInstance.methods.isAdmin(accounts[0]).call();
      const voterStatus = await contractInstance.methods.isVoter(accounts[0]).call();
      
      setIsAdmin(adminStatus);
      setIsVoter(voterStatus);
      setLoading(false);
    } catch (error) {
      alert("Failed to load web3 or contract. " + error.message);
      console.error(error);
    }
  };

  const registerAsVoter = async () => {
    try {
      await contract.methods.addVoter().send({ from: account });
      setIsVoter(true);
      alert("Successfully registered as voter!");
    } catch (error) {
      alert("Failed to register: " + error.message);
    }
  };

  useEffect(() => {
    initializeWeb3();
  }, []);

  if (loading) {
    return <Box sx={{ textAlign: 'center', mt: 4 }}>Loading...</Box>;
  }

  if (isAdmin) {
    return <Admin contract={contract} account={account} />;
  }

  if (isVoter) {
    return <Vote contract={contract} account={account} />;
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome to the Voting System
      </Typography>
      <Typography variant="body1" gutterBottom>
        Register to participate in the election
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={registerAsVoter}
        sx={{ mt: 2 }}
      >
        Register to Vote
      </Button>
    </Box>
  );
}
