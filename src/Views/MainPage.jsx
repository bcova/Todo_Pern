import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, CardActions, IconButton } from "@mui/material";
import { CardHeader } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { addTodo } from "../Api/todoApi";
import { getTodos } from "../Api/todoApi";
import { gsap } from "gsap";
import { useQuery, useMutation } from "react-query";
import { queryClient } from "../queryClient";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTodo } from "../Api/todoApi";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import PatternSVG from "../assets/PatternSVG";
import debounce from "lodash/debounce";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "transparent" : "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  height: "50vh",
  width: "100vw",
  color: theme.palette.text.secondary,
}));

export default function MainPage() {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [severity, setSeverity] = useState("");
  const [category, setCategory] = useState("");
  const [textColor, setTextColor] = useState("white");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoError, setTodoError] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [currentExpandedIndex, setCurrentExpandedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("None");
  const handleModalClose = () => setOpen(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date);
  };
  const handleSeverity = (event) => {
    setSeverity(event.target.value);
    if (event.target.value === "Low") {
      setTextColor("green");
    } else if (event.target.value === "Medium") {
      setTextColor("orange");
    } else if (event.target.value === "High") {
      setTextColor("red");
    } else {
      setTextColor("white");
    }
  };
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const TodoSeverityColor = (severity) => {
    const colorMap = {
      Low: "success",
      Medium: "warning",
      High: "error",
    };
    console.log({ severity });

    // Check if the provided severity exists in the map, and return the corresponding color
    return colorMap[severity] || "primary"; // Default to white if severity is not found
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleCustomCategoryChange = (event) => {
    setCustomCategory(event.target.value);
  };

  const handleClose = () => {
    setTodoError(false);
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="right" />;
  }
  const handleAddTodo = () => {
    const date = selectedDate.toLocaleString();
    console.log(date);
    if (!title || !severity || !category || !date) {
      setTodoError(true);
    } else {
      setLoading(true);

      const newTodo = {
        title,
        description,
        due_date: date,
        severity,
        category,
      };

      addTodoMutation.mutate(newTodo, {
        onSuccess: async () => {
          setTitle("");
          setDescription("");
          setSelectedDate(new Date());
          setSeverity("");
          setCategory("");

          await new Promise((resolve) => setTimeout(resolve, 2));
          setLoading(false);

          const lastTodoCard = containerRef.current.querySelector(
            ".todo-card:first-child"
          );
          if (lastTodoCard) {
            gsap.fromTo(
              lastTodoCard,
              { x: -1000 },
              { x: 0, duration: 0.6, delay: 0.002, ease: "power2" }
            );
          }
        },
      });
    }
  };

  const debouncedAddTodo = debounce(handleAddTodo, 1000);

  const handleDeleteTodo = async (todoID) => {
    // Find the element with the corresponding todoID
    const todoItem = document.querySelector(`.todo-${todoID}`);

    if (todoItem) {
      gsap.to(todoItem, {
        x: -1000,
        duration: 0.5,
        onComplete: () => {
          deleteTodoMutation.mutate(todoID);
        },
      });
    }
  };

  const handleLogout = () => {
    navigate("/");
    sessionStorage.clear();
  };

  const addTodoMutation = useMutation(
    (newTodo) =>
      addTodo(
        newTodo.title,
        newTodo.description,
        newTodo.due_date,
        newTodo.severity,
        newTodo.category,
        userData.user_id
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const deleteTodoMutation = useMutation((todoID) => deleteTodo(todoID), {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const {
    data: todos,
    error,
    isLoading,
  } = useQuery("todos", () => getTodos(userData?.user_id));
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const ExpandMore = styled((props) => {
    const { ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const handleExpandClick = (index) => {
    if (currentExpandedIndex === index) {
      // Clicking on the same card that is already expanded, so close it
      setCurrentExpandedIndex(-1);
    } else {
      // Clicking on a different card, so expand it and close the previous one
      setCurrentExpandedIndex(index);
    }
  };

  const handleEditTodo = (todoID) => {
    setOpen(true);
    console.log(todoID);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "secondary.main",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "5px",
  };

  const noneSeverityCount = todos.data?.filter(
    (todo) => todo.severity === "None" && !todo.timeremaining.includes("ago")
  ).length;
  const lowSeverityCount = todos.data?.filter(
    (todo) => todo.severity === "Low"
  ).length;
  const mediumSeverityCount = todos.data?.filter(
    (todo) => todo.severity === "Medium"
  ).length;
  const highSeverityCount = todos.data?.filter(
    (todo) => todo.severity === "High"
  ).length;
  const overDueSeverityCount = todos.data?.filter((todo) =>
    todo.timeremaining.includes("ago")
  ).length;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(0deg, #42275a 20%, #734b6d 90%)",
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Snackbar
        open={todoError}
        autoHideDuration={2000}
        onClose={handleClose}
        TransitionComponent={TransitionLeft}
      >
        <Alert variant="filled" severity="error">
          <Typography>Fill in all todo fields!</Typography>
        </Alert>
      </Snackbar>

      <Grid container spacing={0} disableEqualOverflow gap={0}>
        <Grid item xs={12} width={"100vw"}>
          <Item>
            <Container
              disableGutters
              maxWidth="md"
              display="flex"
              justifycontent="center"
              alignitems="center"
              sx={{ height: "48vh", borderRadius: "5px" }}
            >
              <Card
                elevation={10}
                sx={{
                  height: "100%",
                  border: "2px solid black",
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.15),
                  position: "relative",
                }}
              >
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  sx={{ position: "absolute", top: "18px", right: "10px" }}
                >
                  <Typography>Log Out</Typography>
                </Button>
                <CardHeader
                  title="Add Todo"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.common.black, 0.4),
                    color: "white",
                    ".MuiTypography-root": { fontSize: "2rem" },
                    textAlign: "left",
                  }}
                />
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "start",
                    height: "100%",
                    gap: "15px",
                  }}
                >
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <TextField
                    fullWidth
                    multiline
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Select Due Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        textFieldProps={{
                          fullWidth: true,
                          variant: "outlined",
                        }}
                        sx={{ ".MuiButtonBase-root": { color: "white " } }}
                      />
                    </LocalizationProvider>
                    <Box sx={{ gap: "50px", display: "flex" }}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel
                          sx={{ color: "white" }}
                          id="demo-simple-select-standard-label"
                        >
                          Severity
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={severity}
                          onChange={handleSeverity}
                          label="Severity"
                          sx={{ color: textColor, fontWeight: "bold" }}
                        >
                          <MenuItem value="None" sx={{ color: "black" }}>
                            <Typography sx={{ color: "black" }}>
                              None
                            </Typography>
                          </MenuItem>
                          <MenuItem
                            sx={{ bgcolor: "green", color: "black" }}
                            divider={true}
                            value={"Low"}
                          >
                            Low{" "}
                          </MenuItem>
                          <MenuItem
                            sx={{ bgcolor: "orange", color: "black" }}
                            divider={true}
                            value={"Medium"}
                          >
                            Medium{" "}
                          </MenuItem>
                          <MenuItem
                            sx={{ bgcolor: "red", color: "black" }}
                            divider={true}
                            value={"High"}
                          >
                            High{" "}
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel
                          sx={{ color: "white" }}
                          id="demo-simple-select-standard-label"
                        >
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={category}
                          onChange={handleCategory}
                          label="Category"
                          sx={{ color: "white", fontWeight: "bold" }}
                          variant="standard"
                        >
                          <MenuItem value="None" sx={{ color: "black" }}>
                            <Typography sx={{ color: "black" }}>
                              None
                            </Typography>
                          </MenuItem>
                          <MenuItem
                            divider={true}
                            value={"Home"}
                            sx={{ color: "black" }}
                          >
                            Home{" "}
                          </MenuItem>
                          <MenuItem
                            divider={true}
                            value={"Work"}
                            sx={{ color: "black" }}
                          >
                            Work{" "}
                          </MenuItem>
                          <MenuItem
                            divider={true}
                            value={"School"}
                            sx={{ color: "black" }}
                          >
                            School{" "}
                          </MenuItem>
                          <MenuItem
                            divider={true}
                            value={"Custom"}
                            sx={{ color: "black" }}
                          >
                            Custom
                          </MenuItem>
                        </Select>
                        {category === "Custom" && (
                          <TextField
                            label="Custom Category"
                            value={customCategory}
                            onChange={handleCustomCategoryChange}
                            variant="outlined"
                            fullWidth
                            sx={{
                              position: "absolute",
                              top: "60px",
                              right: "0px",
                              width: "150px",
                            }}
                          />
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={debouncedAddTodo}
                    sx={{ alignSelf: "start" }}
                  >
                    <Typography>Add Todo</Typography>
                  </Button>
                </CardContent>
              </Card>
            </Container>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Container
              disableGutters
              maxWidth="md"
              display="flex"
              justifycontent="center"
              alignitems="center"
              sx={{ height: "48vh", borderRadius: "5px" }}
              ref={containerRef}
            >
              <Card
                elevation={10}
                sx={{
                  height: "100%",
                  border: "2px solid black",
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.15),
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "0.0em",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    height: "max-content",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleTabChange}
                          aria-label="lab API tabs example"
                          sx={{
                            "& .MuiTabs-indicator": {
                              backgroundColor:
                                value === "None"
                                  ? "white"
                                  : value === "Low"
                                  ? "green"
                                  : value === "Medium"
                                  ? "orange"
                                  : value === "High"
                                  ? "red"
                                  : "primary", // Default to primary color if severity is not found
                            },
                            "& .Mui-selected": {
                              backgroundColor: (theme) =>
                                alpha(theme.palette.common.black, 0.2),
                              borderRadius: "5px 5px 0px 0px ",
                              border: "solid 1px  ",
                              borderColor:
                                value === "None"
                                  ? "white"
                                  : value === "Low"
                                  ? "green"
                                  : value === "Medium"
                                  ? "orange"
                                  : value === "High"
                                  ? "red"
                                  : "primary",
                            },
                          }}
                        >
                          <Tab
                            label={`None (${noneSeverityCount})`}
                            value="None"
                            sx={{ color: "white" }}
                          />
                          <Tab
                            label={`Low (${lowSeverityCount})`}
                            value="Low"
                            sx={{ color: "green" }}
                          />
                          <Tab
                            label={`Medium (${mediumSeverityCount})`}
                            value="Medium"
                            sx={{ color: "orange" }}
                          />
                          <Tab
                            label={`High (${highSeverityCount})`}
                            value="High"
                            sx={{ color: "red" }}
                          />
                          <Tab
                            label={`Overdue (${overDueSeverityCount})`}
                            value="Overdue"
                            sx={{ color: "red", fontWeight: "bold" }}
                          />
                        </TabList>
                      </Box>
                      <TabPanel value="None">
                        <TransitionGroup>
                          {todos.data
                            ?.filter(
                              (todo) =>
                                todo.severity === "None" &&
                                !todo.timeremaining.includes("ago")
                            )
                            .map((todo, index) => (
                              <Collapse key={todo.todo_id}>
                                <Card
                                  sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    borderRadius: "5px",
                                    border: "2px solid black",
                                    marginBottom: "10px",
                                  }}
                                  className={`todo-card todo-${todo.todo_id}`}
                                  elevation={5}
                                >
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "-10px",
                                      bgcolor: "#734b6d",
                                      zIndex: -1,
                                      filter: "blur(3px) brightness(0.7)",
                                    }}
                                  >
                                    <PatternSVG />
                                  </Box>
                                  <CardHeader
                                    title={todo.title}
                                    titleTypographyProps={{
                                      textAlign: "left",
                                    }}
                                    subheader={
                                      <Box
                                        display={"flex"}
                                        width={"min-content"}
                                        gap={"10px"}
                                      >
                                        <Chip
                                          color={TodoSeverityColor(
                                            todo.severity
                                          )}
                                          label={todo.severity}
                                        />
                                      </Box>
                                    }
                                    action={
                                      <Box display="flex">
                                        <IconButton
                                          onClick={() =>
                                            handleEditTodo(todo.todo_id)
                                          }
                                        >
                                          <EditIcon sx={{ color: "white" }} />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            handleDeleteTodo(todo.todo_id)
                                          }
                                        >
                                          <DeleteIcon sx={{ color: "red" }} />
                                        </IconButton>
                                      </Box>
                                    }
                                    sx={{
                                      marginBottom: "0px",
                                    }}
                                  />
                                  <Modal
                                    open={open}
                                    onClose={handleModalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                      >
                                        Edit Todo:
                                      </Typography>
                                      <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                      >
                                        Duis mollis, est non commodo luctus,
                                        nisi erat porttitor ligula.
                                      </Typography>
                                    </Box>
                                  </Modal>
                                  <CardContent
                                    sx={{
                                      padding: "0px 0px 10px 0px",
                                    }}
                                  >
                                    <Typography>
                                      Category: {todo.category}
                                    </Typography>
                                    <Typography
                                      color={
                                        todo.timeremaining.includes("ago") ||
                                        todo.timeremaining.includes("Today")
                                          ? "red"
                                          : "green"
                                      }
                                    >
                                      Due: {todo.timeremaining}
                                    </Typography>
                                    <Typography>
                                      Created: {todo.timeago}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    disableGutters
                                    disableSpacing
                                    sx={{
                                      padding: "0px",
                                      height: "min-content",
                                      width: "min-content",
                                      position: "absolute",
                                      bottom: "0px",
                                      right: "0px",
                                    }}
                                  >
                                    <Typography
                                      width={"100%"}
                                      textAlign={"right"}
                                    >
                                      Details
                                    </Typography>
                                    <ExpandMore
                                      expand={currentExpandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expanded}
                                      aria-label="show more"
                                    >
                                      <ExpandMoreIcon sx={{ color: "white" }} />
                                    </ExpandMore>
                                  </CardActions>
                                  <Collapse
                                    in={currentExpandedIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="h6"
                                        width={"100%"}
                                        textAlign={"left"}
                                      >
                                        Description:{" "}
                                        <Typography variant="body1">
                                          {todo.description}
                                        </Typography>
                                      </Typography>
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </Collapse>
                            ))}
                          {noneSeverityCount === 0 && (
                            <Typography>No todos to show</Typography>
                          )}
                        </TransitionGroup>
                      </TabPanel>
                      <TabPanel value="Low">
                        <TransitionGroup>
                          {todos.data
                            ?.filter((todo) => todo.severity === "Low")
                            .map((todo, index) => (
                              <Collapse key={todo.todo_id}>
                                <Card
                                  sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    borderRadius: "5px",
                                    border: "2px solid black",
                                    marginBottom: "10px",
                                  }}
                                  className={`todo-card todo-${todo.todo_id}`}
                                  elevation={5}
                                >
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "-10px",
                                      bgcolor: "#734b6d",
                                      zIndex: -1,
                                      filter: "blur(3px) brightness(0.7)",
                                    }}
                                  >
                                    <PatternSVG />
                                  </Box>
                                  <CardHeader
                                    title={todo.title}
                                    titleTypographyProps={{
                                      textAlign: "left",
                                    }}
                                    subheader={
                                      <Box
                                        display={"flex"}
                                        width={"min-content"}
                                        gap={"10px"}
                                      >
                                        <Chip
                                          color={TodoSeverityColor(
                                            todo.severity
                                          )}
                                          label={todo.severity}
                                        />
                                      </Box>
                                    }
                                    action={
                                      <Box display="flex">
                                        <IconButton
                                          onClick={() =>
                                            handleEditTodo(todo.todo_id)
                                          }
                                        >
                                          <EditIcon sx={{ color: "white" }} />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            handleDeleteTodo(todo.todo_id)
                                          }
                                        >
                                          <DeleteIcon sx={{ color: "red" }} />
                                        </IconButton>
                                      </Box>
                                    }
                                    sx={{
                                      marginBottom: "0px",
                                    }}
                                  />
                                  <Modal
                                    open={open}
                                    onClose={handleModalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                      >
                                        Edit Todo:
                                      </Typography>
                                      <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                      >
                                        Duis mollis, est non commodo luctus,
                                        nisi erat porttitor ligula.
                                      </Typography>
                                    </Box>
                                  </Modal>
                                  <CardContent
                                    sx={{
                                      padding: "0px 0px 10px 0px",
                                    }}
                                  >
                                    <Typography>
                                      Category: {todo.category}
                                    </Typography>
                                    <Typography
                                      color={
                                        todo.timeremaining.includes("ago") ||
                                        todo.timeremaining.includes("Today")
                                          ? "red"
                                          : "green"
                                      }
                                    >
                                      Due: {todo.timeremaining}
                                    </Typography>
                                    <Typography>
                                      Created: {todo.timeago}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    disableGutters
                                    disableSpacing
                                    sx={{
                                      padding: "0px",
                                      height: "min-content",
                                      width: "min-content",
                                      position: "absolute",
                                      bottom: "0px",
                                      right: "0px",
                                    }}
                                  >
                                    <Typography
                                      width={"100%"}
                                      textAlign={"right"}
                                    >
                                      Details
                                    </Typography>
                                    <ExpandMore
                                      expand={currentExpandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expanded}
                                      aria-label="show more"
                                    >
                                      <ExpandMoreIcon sx={{ color: "white" }} />
                                    </ExpandMore>
                                  </CardActions>
                                  <Collapse
                                    in={currentExpandedIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="h6"
                                        width={"100%"}
                                        textAlign={"left"}
                                      >
                                        Description:{" "}
                                        <Typography variant="body1">
                                          {todo.description}
                                        </Typography>
                                      </Typography>
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </Collapse>
                            ))}






                            
                                {lowSeverityCount === 0 && (
                            <Typography>No todos to show</Typography>
                          )}
                        </TransitionGroup>
                      </TabPanel>
                      <TabPanel value="Medium">
                        <TransitionGroup>
                          {todos.data
                            ?.filter((todo) => todo.severity === "Medium")
                            .map((todo, index) => (
                              <Collapse key={todo.todo_id}>
                                <Card
                                  sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    borderRadius: "5px",
                                    border: "2px solid black",
                                    marginBottom: "10px",
                                  }}
                                  className={`todo-card todo-${todo.todo_id}`}
                                  elevation={5}
                                >
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "-10px",
                                      bgcolor: "#734b6d",
                                      zIndex: -1,
                                      filter: "blur(3px) brightness(0.7)",
                                    }}
                                  >
                                    <PatternSVG />
                                  </Box>
                                  <CardHeader
                                    title={todo.title}
                                    titleTypographyProps={{
                                      textAlign: "left",
                                    }}
                                    subheader={
                                      <Box
                                        display={"flex"}
                                        width={"min-content"}
                                        gap={"10px"}
                                      >
                                        <Chip
                                          color={TodoSeverityColor(
                                            todo.severity
                                          )}
                                          label={todo.severity}
                                        />
                                      </Box>
                                    }
                                    action={
                                      <Box display="flex">
                                        <IconButton
                                          onClick={() =>
                                            handleEditTodo(todo.todo_id)
                                          }
                                        >
                                          <EditIcon sx={{ color: "white" }} />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            handleDeleteTodo(todo.todo_id)
                                          }
                                        >
                                          <DeleteIcon sx={{ color: "red" }} />
                                        </IconButton>
                                      </Box>
                                    }
                                    sx={{
                                      marginBottom: "0px",
                                    }}
                                  />
                                  <Modal
                                    open={open}
                                    onClose={handleModalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                      >
                                        Edit Todo:
                                      </Typography>
                                      <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                      >
                                        Duis mollis, est non commodo luctus,
                                        nisi erat porttitor ligula.
                                      </Typography>
                                    </Box>
                                  </Modal>
                                  <CardContent
                                    sx={{
                                      padding: "0px 0px 10px 0px",
                                    }}
                                  >
                                    <Typography>
                                      Category: {todo.category}
                                    </Typography>
                                    <Typography
                                      color={
                                        todo.timeremaining.includes("ago") ||
                                        todo.timeremaining.includes("Today")
                                          ? "red"
                                          : "green"
                                      }
                                    >
                                      Due: {todo.timeremaining}
                                    </Typography>
                                    <Typography>
                                      Created: {todo.timeago}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    disableGutters
                                    disableSpacing
                                    sx={{
                                      padding: "0px",
                                      height: "min-content",
                                      width: "min-content",
                                      position: "absolute",
                                      bottom: "0px",
                                      right: "0px",
                                    }}
                                  >
                                    <Typography
                                      width={"100%"}
                                      textAlign={"right"}
                                    >
                                      Details
                                    </Typography>
                                    <ExpandMore
                                      expand={currentExpandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expanded}
                                      aria-label="show more"
                                    >
                                      <ExpandMoreIcon sx={{ color: "white" }} />
                                    </ExpandMore>
                                  </CardActions>
                                  <Collapse
                                    in={currentExpandedIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="h6"
                                        width={"100%"}
                                        textAlign={"left"}
                                      >
                                        Description:{" "}
                                        <Typography variant="body1">
                                          {todo.description}
                                        </Typography>
                                      </Typography>
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </Collapse>
                            ))}
                                {todos.data && todos.data.length === 0 && (
                            <Typography>No todos to show</Typography>
                          )}
                        </TransitionGroup>
                      </TabPanel>
                      <TabPanel value="High">
                        <TransitionGroup>
                          {todos.data
                            ?.filter((todo) => todo.severity === "High")
                            .map((todo, index) => (
                              <Collapse key={todo.todo_id}>
                                <Card
                                  sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    borderRadius: "5px",
                                    border: "2px solid black",
                                    marginBottom: "10px",
                                  }}
                                  className={`todo-card todo-${todo.todo_id}`}
                                  elevation={5}
                                >
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "-10px",
                                      bgcolor: "#734b6d",
                                      zIndex: -1,
                                      filter: "blur(3px) brightness(0.7)",
                                    }}
                                  >
                                    <PatternSVG />
                                  </Box>
                                  <CardHeader
                                    title={todo.title}
                                    titleTypographyProps={{
                                      textAlign: "left",
                                    }}
                                    subheader={
                                      <Box
                                        display={"flex"}
                                        width={"min-content"}
                                        gap={"10px"}
                                      >
                                        <Chip
                                          color={TodoSeverityColor(
                                            todo.severity
                                          )}
                                          label={todo.severity}
                                        />
                                      </Box>
                                    }
                                    action={
                                      <Box display="flex">
                                        <IconButton
                                          onClick={() =>
                                            handleEditTodo(todo.todo_id)
                                          }
                                        >
                                          <EditIcon sx={{ color: "white" }} />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            handleDeleteTodo(todo.todo_id)
                                          }
                                        >
                                          <DeleteIcon sx={{ color: "red" }} />
                                        </IconButton>
                                      </Box>
                                    }
                                    sx={{
                                      marginBottom: "0px",
                                    }}
                                  />
                                  <Modal
                                    open={open}
                                    onClose={handleModalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                      >
                                        Edit Todo:
                                      </Typography>
                                      <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                      >
                                        Duis mollis, est non commodo luctus,
                                        nisi erat porttitor ligula.
                                      </Typography>
                                    </Box>
                                  </Modal>
                                  <CardContent
                                    sx={{
                                      padding: "0px 0px 10px 0px",
                                    }}
                                  >
                                    <Typography>
                                      Category: {todo.category}
                                    </Typography>
                                    <Typography
                                      color={
                                        todo.timeremaining.includes("ago") ||
                                        todo.timeremaining.includes("Today")
                                          ? "red"
                                          : "green"
                                      }
                                    >
                                      Due: {todo.timeremaining}
                                    </Typography>
                                    <Typography>
                                      Created: {todo.timeago}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    disableGutters
                                    disableSpacing
                                    sx={{
                                      padding: "0px",
                                      height: "min-content",
                                      width: "min-content",
                                      position: "absolute",
                                      bottom: "0px",
                                      right: "0px",
                                    }}
                                  >
                                    <Typography
                                      width={"100%"}
                                      textAlign={"right"}
                                    >
                                      Details
                                    </Typography>
                                    <ExpandMore
                                      expand={currentExpandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expanded}
                                      aria-label="show more"
                                    >
                                      <ExpandMoreIcon sx={{ color: "white" }} />
                                    </ExpandMore>
                                  </CardActions>
                                  <Collapse
                                    in={currentExpandedIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="h6"
                                        width={"100%"}
                                        textAlign={"left"}
                                      >
                                        Description:{" "}
                                        <Typography variant="body1">
                                          {todo.description}
                                        </Typography>
                                      </Typography>
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </Collapse>
                            ))}
                                {todos.data && todos.data.length === 0 && (
                            <Typography>No todos to show</Typography>
                          )}
                        </TransitionGroup>
                      </TabPanel>
                      <TabPanel value="Overdue">
                        <TransitionGroup>
                          {todos.data
                            ?.filter((todo) =>
                              todo.timeremaining.includes("ago")
                            )
                            .map((todo, index) => (
                              <Collapse key={todo.todo_id}>
                                <Card
                                  sx={{
                                    position: "relative",
                                    zIndex: 1,
                                    borderRadius: "5px",
                                    border: "2px solid black",
                                    marginBottom: "10px",
                                  }}
                                  className={`todo-card todo-${todo.todo_id}`}
                                  elevation={5}
                                >
                                  <Box
                                    sx={{
                                      position: "absolute",
                                      top: "-10px",
                                      left: "-10px",
                                      bgcolor: "#734b6d",
                                      zIndex: -1,
                                      filter: "blur(3px) brightness(0.7)",
                                    }}
                                  >
                                    <PatternSVG />
                                  </Box>
                                  <CardHeader
                                    title={todo.title}
                                    titleTypographyProps={{
                                      textAlign: "left",
                                    }}
                                    subheader={
                                      <Box
                                        display={"flex"}
                                        width={"min-content"}
                                        gap={"10px"}
                                      >
                                        <Chip
                                          color={TodoSeverityColor(
                                            todo.severity
                                          )}
                                          label={todo.severity}
                                        />
                                      </Box>
                                    }
                                    action={
                                      <Box display="flex">
                                        <IconButton
                                          onClick={() =>
                                            handleEditTodo(todo.todo_id)
                                          }
                                        >
                                          <EditIcon sx={{ color: "white" }} />
                                        </IconButton>
                                        <IconButton
                                          onClick={() =>
                                            handleDeleteTodo(todo.todo_id)
                                          }
                                        >
                                          <DeleteIcon sx={{ color: "red" }} />
                                        </IconButton>
                                      </Box>
                                    }
                                    sx={{
                                      marginBottom: "0px",
                                    }}
                                  />
                                  <Modal
                                    open={open}
                                    onClose={handleModalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                      >
                                        Edit Todo:
                                      </Typography>
                                      <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                      >
                                        Duis mollis, est non commodo luctus,
                                        nisi erat porttitor ligula.
                                      </Typography>
                                    </Box>
                                  </Modal>
                                  <CardContent
                                    sx={{
                                      padding: "0px 0px 10px 0px",
                                    }}
                                  >
                                    <Typography>
                                      Category: {todo.category}
                                    </Typography>
                                    <Typography
                                      color={
                                        todo.timeremaining.includes("ago") ||
                                        todo.timeremaining.includes("Today")
                                          ? "red"
                                          : "green"
                                      }
                                    >
                                      Due: {todo.timeremaining}
                                    </Typography>
                                    <Typography>
                                      Created: {todo.timeago}
                                    </Typography>
                                  </CardContent>
                                  <CardActions
                                    disableGutters
                                    disableSpacing
                                    sx={{
                                      padding: "0px",
                                      height: "min-content",
                                      width: "min-content",
                                      position: "absolute",
                                      bottom: "0px",
                                      right: "0px",
                                    }}
                                  >
                                    <Typography
                                      width={"100%"}
                                      textAlign={"right"}
                                    >
                                      Details
                                    </Typography>
                                    <ExpandMore
                                      expand={currentExpandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expanded}
                                      aria-label="show more"
                                    >
                                      <ExpandMoreIcon sx={{ color: "white" }} />
                                    </ExpandMore>
                                  </CardActions>
                                  <Collapse
                                    in={currentExpandedIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <CardContent>
                                      <Typography
                                        variant="h6"
                                        width={"100%"}
                                        textAlign={"left"}
                                      >
                                        Description:{" "}
                                        <Typography variant="body1">
                                          {todo.description}
                                        </Typography>
                                      </Typography>
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </Collapse>
                            ))}
                                {todos.data && todos.data.length === 0 && (
                            <Typography>No todos to show</Typography>
                          )}
                        </TransitionGroup>
                      </TabPanel>
                    </TabContext>
                  </Box>
                  {/* <TransitionGroup>
                    {todos.data?.map((todo, index) => (
                      <Collapse key={todo.todo_id}>
                        <Card
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            borderRadius: "5px",
                            border: "2px solid black",
                            marginBottom: "10px",
                          }}
                          className={`todo-card todo-${todo.todo_id}`}
                          elevation={5}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "-10px",
                              left: "-10px",
                              bgcolor: "#734b6d",
                              zIndex: -1,
                              filter: "blur(3px) brightness(0.7)",
                            }}
                          >
                            <PatternSVG />
                          </Box>
                          <CardHeader
                            title={todo.title}
                            titleTypographyProps={{
                              textAlign: "left",
                            }}
                            subheader={
                              <Box
                                display={"flex"}
                                width={"min-content"}
                                gap={"10px"}
                              >
                                <Chip
                                  color={TodoSeverityColor(todo.severity)}
                                  label={todo.severity}
                                />
                              </Box>
                            }
                            action={
                              <Box display="flex">
                                <IconButton
                                  onClick={() => handleEditTodo(todo.todo_id)}
                                >
                                  <EditIcon sx={{ color: "white" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeleteTodo(todo.todo_id)}
                                >
                                  <DeleteIcon sx={{ color: "red" }} />
                                </IconButton>
                              </Box>
                            }
                            sx={{
                              marginBottom: "0px",
                            }}
                          />
                          <Modal
                            open={open}
                            onClose={handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                Edit Todo:
                              </Typography>
                              <Typography
                                id="modal-modal-description"
                                sx={{ mt: 2 }}
                              >
                                Duis mollis, est non commodo luctus, nisi erat
                                porttitor ligula.
                              </Typography>
                            </Box>
                          </Modal>
                          <CardContent
                            sx={{
                              padding: "0px 0px 10px 0px",
                            }}
                          >
                            <Typography>Category: {todo.category}</Typography>
                            <Typography
                              color={
                                todo.timeremaining.includes("ago") ||
                                todo.timeremaining.includes("Today")
                                  ? "red"
                                  : "green"
                              }
                            >
                              Due: {todo.timeremaining}
                            </Typography>
                            <Typography>Created: {todo.timeago}</Typography>
                          </CardContent>
                          <CardActions
                            disableGutters
                            disableSpacing
                            sx={{
                              padding: "0px",
                              height: "min-content",
                              width: "min-content",
                              position: "absolute",
                              bottom: "0px",
                              right: "0px",
                            }}
                          >
                            <Typography width={"100%"} textAlign={"right"}>
                              Details
                            </Typography>
                            <ExpandMore
                              expand={currentExpandedIndex === index}
                              onClick={() => handleExpandClick(index)}
                              aria-expanded={expanded}
                              aria-label="show more"
                            >
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            </ExpandMore>
                          </CardActions>
                          <Collapse
                            in={currentExpandedIndex === index}
                            timeout="auto"
                            unmountOnExit
                          >
                            <CardContent>
                              <Typography
                                variant="h6"
                                width={"100%"}
                                textAlign={"left"}
                              >
                                Description:{" "}
                                <Typography variant="body1">
                                  {todo.description}
                                </Typography>
                              </Typography>
                            </CardContent>
                          </Collapse>
                        </Card>
                      </Collapse>
                    ))}
                  </TransitionGroup> */}
                </CardContent>
              </Card>
            </Container>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
