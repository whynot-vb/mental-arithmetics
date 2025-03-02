import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect, useCallback } from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "120px", // 20% veća visina od širine (100px širina + 20% = 120px visina)
  width: "100px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid black",
}));

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperator() {
  return Math.random() < 0.5 ? "+" : "-";
}

function generateItems() {
  return Array.from({ length: 120 }, (_, index) => {
    let num1, num2;
    const operator = getRandomOperator();

    if (index < 40) {
      // Prvih 40: brojevi od 1 do 10
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
    } else if (index >= 80) {
      // Poslednjih 40: trocifreni brojevi
      num1 = getRandomInt(100, 999);
      num2 = getRandomInt(100, 999);
    } else {
      // Srednjih 40: brojevi od 1 do 100
      num1 = getRandomInt(1, 100);
      num2 = getRandomInt(1, 100);
    }

    // Ensure num1 >= num2 for subtraction
    if (operator === "-" && num1 < num2) {
      [num1, num2] = [num2, num1];
    }

    return { num1, num2, operator };
  });
}

export default function First() {
  const [timeLeft, setTimeLeft] = useState(12 * 60); // 12 minuta u sekundama
  const [timerActive, setTimerActive] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [items, setItems] = useState(generateItems);

  const resetFields = useCallback(() => {
    items.forEach((_, index) => {
      const input = document.getElementById(
        `input-${index}`
      ) as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    });
    setItems(generateItems());
    setTimeLeft(12 * 60);
    setCorrectAnswers(0);
  }, [items]);

  const calculateCorrectAnswers = useCallback(() => {
    let correct = 0;
    items.forEach((item, index) => {
      const input = document.getElementById(
        `input-${index}`
      ) as HTMLInputElement;
      if (input) {
        const userAnswer = parseInt(input.value, 10);
        const correctAnswer =
          item.operator === "+" ? item.num1 + item.num2 : item.num1 - item.num2;
        if (userAnswer === correctAnswer) {
          correct++;
        }
      }
    });
    setCorrectAnswers(correct);
  }, [items]);

  const endTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerActive(false);
    calculateCorrectAnswers();
    setOpenSnackbar(true);
    setTimeout(() => {
      resetFields();
      handleCloseSnackbar();
    }, 3000); // Resetovanje polja i zatvaranje notifikacije nakon 3 sekunde
  }, [calculateCorrectAnswers, resetFields]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endTimer();
    }
  }, [timerRunning, timeLeft, endTimer]);

  const startTimer = () => {
    if (timerRunning) {
      endTimer();
    } else {
      setTimeLeft(12 * 60);
      setTimerRunning(true);
      setTimerActive(true);
      setCorrectAnswers(0);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const gridItems = items.map((item, index) => (
    <Grid item xs={2} key={index}>
      <Item>
        <div>{item.num1}</div>
        <div>{item.operator}</div>
        <div>{item.num2}</div>
        <hr style={{ width: "100%" }} />
        <TextField
          id={`input-${index}`}
          variant="outlined"
          size="small"
          type="number"
        />
      </Item>
    </Grid>
  ));

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#ADD8E6",
        padding: 2,
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%", fontSize: "1.5rem" }} // Značajno uvećana notifikacija
        >
          Tačnih odgovora: {correctAnswers}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        {timerActive && (
          <Typography variant="h2" sx={{ color: "red", marginRight: 2 }}>
            {formatTime(timeLeft)}
          </Typography>
        )}
        <Typography variant="h2" align="center" gutterBottom marginTop={2}>
          PRVI DEO
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button variant="contained" size="large" onClick={startTimer}>
          {timerRunning ? "END" : "START"}
        </Button>
      </Box>
      <Grid container spacing={2}>
        {gridItems}
      </Grid>
    </Box>
  );
}
