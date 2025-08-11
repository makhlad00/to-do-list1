import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

type Task = { id: string; text: string; completed: boolean };

const Todo = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
    setTask('');
  };

  const toggleComplete = (id: string) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const deleteTask = (id: string) =>
    setTasks(tasks.filter(t => t.id !== id));

  const startEdit = (id: string, text: string) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: editText } : t));
    setEditId(null);
    setEditText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {editId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editText}
                  onChangeText={setEditText}
                />
                <TouchableOpacity
                  onPress={() => saveEdit(item.id)}
                  style={styles.addButton}
                >
                  <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.completedText
                    ]}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
                <View style={styles.inputRow}>
                  <TouchableOpacity onPress={() => startEdit(item.id, item.text)}>
                    <Text style={styles.editButton}> ✏️ </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Text style={styles.deleteButton}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  taskText: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    fontSize: 20,
    color: 'red',
  },
  editButton:{
    fontSize: 20,
    color: 'grey',
  },
});

export default Todo;
