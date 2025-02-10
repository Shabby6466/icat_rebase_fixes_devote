import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";

export default function VotersForm({ contract, web3, currentAccount }) {
  const [name, setName] = useState("");

  const handleForm = async (event) => {
    event.preventDefault();
    try {
      if (!web3.utils.isAddress(name)) {
        throw new Error("Invalid Ethereum address");
      }
      
      await contract.methods.addVoter(name).send({ from: currentAccount });
      alert("Voter added successfully!");
      setName("");
    } catch (error) {
      console.error("Error adding voter:", error);
      alert("Error adding voter: " + (error.message || "Unknown error occurred"));
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        width: "40%",
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleForm}
    >
      <Stack spacing={2}>
        <TextField
          id="outlined-basic"
          label="Voters Address"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
        />
        <Button variant="contained" type="submit">
          Add Voter
        </Button>
      </Stack>
    </Box>
  );
}
