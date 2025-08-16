import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Task = { id: string; text: string; completed: boolean; date: string };

const Todo = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const addTask = () => {
    if (!task.trim() || !selectedDate) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        text: task,
        completed: false,
        date: selectedDate.toLocaleDateString(),
      },
    ]);
    setTask('');
    setSelectedDate(null);
  };

  const toggleComplete = (id: string) =>
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id: string) =>
    setTasks(tasks.filter(t => t.id !== id));

  const startEdit = (id: string, text: string, date: string) => {
    setEditId(id);
    setEditText(text);
    setEditDate(date);
  };

  const saveEdit = (id: string) => {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, text: editText, date: editDate } : t
      )
    );
    setEditId(null);
    setEditText('');
    setEditDate('');
  };

  const onChangeDate = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      if (editId) {
        setEditDate(date.toLocaleDateString());
      } else {
        setSelectedDate(date);
      }
    }
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
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>📅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      {selectedDate && (
        <Text style={{ marginBottom: 10, color: '#555' }}>
          Selected Date: {selectedDate.toLocaleDateString()}
        </Text>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {editId === item.id ? (
              <>
                <TextInput
                  style={[styles.input, { marginBottom: 5 }]}
                  value={editText}
                  onChangeText={setEditText}
                />

                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateBadge}
                >
                  <Text style={styles.dateText}>
                    {editDate || 'Pick a date'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveEdit(item.id)}
                  style={styles.addButton}
                >
                  <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                 
                <View>
                  <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                  <Text
                    style={[
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
                </View>
                <View style={styles.inputRow}>
                  <TouchableOpacity
                  onPress={() => startEdit(item.id, item.text, item.date)}
                >
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>{item.date}</Text>
                  </View>
                </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      startEdit(item.id, item.text, item.date)
                    }
                  >
                    <Text style={styles.editButton}>✏️</Text>
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
    marginBottom: 10,
    
    alignItems: 'center',
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
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexWrap: 'wrap',
  },
  taskText: {
    fontSize: 18,
    maxWidth: '50%',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    fontSize: 20,
    color: 'red',
    marginLeft: 10,
  },
  editButton: {
    fontSize: 20,
    color: 'grey',
    marginLeft: 10,
  },
  dateBadge: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#555',
    alignContent: 'center'
  },
});

export default Todo;
