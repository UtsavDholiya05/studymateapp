import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ToDoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks:", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: taskInput, completed: false }]);
      setTaskInput("");
    } else {
      alert("Please enter a task.");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <View style={styles.circleIcon} />
      <TouchableOpacity
        onPress={() => toggleTaskCompletion(item.id)}
        style={[
          styles.taskTextContainer,
          item.completed && styles.completedTask,
        ]}
      >
        <Text style={styles.taskText}>{item.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash" size={24} color="#f5f5dc" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={width * 0.08} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>To-Do List</Text>
      </View>

      {/* Task Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={taskInput}
          onChangeText={setTaskInput}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginBottom: width * 0.05,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  headerText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "PlayfairDisplay_400Regular",
  },
  inputSection: {
    flexDirection: "row",
    marginBottom: width * 0.05,
    backgroundColor: "#FFFFF1",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.02,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#000",
    fontFamily: "Inter_400Regular",
    paddingVertical: width * 0.02,
  },
  addButton: {
    backgroundColor: "#9CA37C",
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.04,
    fontFamily: "Inter_400Regular",
  },
  taskList: {
    paddingBottom: width * 0.05,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginBottom: width * 0.03,
  },
  circleIcon: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.025,
    backgroundColor: "#9CA37C",
    marginRight: width * 0.03,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: width * 0.04,
    color: "#f5f5dc",
    fontFamily: "Inter_400Regular",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#9CA37C",
  },
});

export default ToDoPage;