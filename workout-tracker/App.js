import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  bg: '#1a1a2e',
  card: '#16213e',
  accent: '#e94560',
  text: '#ffffff',
  muted: '#aaaaaa',
  input: '#0f3460',
  success: '#4caf50',
};

function buildPlan(days) { return days; }

function getClosestDays(plan, days) {
  const available = Object.keys(plan).map(Number);
  return available.reduce((prev, curr) =>
    Math.abs(curr - days) < Math.abs(prev - days) ? curr : prev
  );
}

const WORKOUT_PLANS = {
  'Lose Weight': {
    Beginner: {
      1: buildPlan([
        { day: 'Day 1 – Full Body', exercises: ['Bodyweight Squats 3×15', 'Push-Ups 3×10', 'Plank 3×30s', 'Jumping Jacks 3×30', 'Mountain Climbers 3×20'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Lower Body', exercises: ['Squats 3×15', 'Lunges 3×12', 'Glute Bridges 3×15', 'Calf Raises 3×20'] },
        { day: 'Day 2 – Upper Body', exercises: ['Push-Ups 3×10', 'Dumbbell Rows 3×12', 'Shoulder Press 3×10', 'Bicep Curls 3×12'] },
        { day: 'Day 3 – Cardio & Core', exercises: ['Jumping Jacks 3×30', 'Mountain Climbers 3×20', 'Plank 3×30s', 'Crunches 3×20', 'Burpees 3×10'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Chest & Triceps', exercises: ['Push-Ups 4×12', 'Dips 3×10', 'Chest Flys 3×12', 'Tricep Kickbacks 3×12'] },
        { day: 'Day 2 – Back & Biceps', exercises: ['Dumbbell Rows 4×12', 'Bicep Curls 3×12', 'Lat Pulldowns 3×12', 'Hammer Curls 3×12'] },
        { day: 'Day 3 – Cardio', exercises: ['Jump Rope 5×2min', 'Burpees 4×10', 'High Knees 4×30s', 'Box Jumps 3×10'] },
        { day: 'Day 4 – Legs', exercises: ['Squats 4×15', 'Lunges 3×12', 'Leg Press 3×15', 'Calf Raises 4×20'] },
        { day: 'Day 5 – Core & Shoulders', exercises: ['Plank 4×45s', 'Crunches 4×20', 'Shoulder Press 3×12', 'Lateral Raises 3×12'] },
      ]),
    },
    Intermediate: {
      1: buildPlan([
        { day: 'Day 1 – Full Body HIIT', exercises: ['Burpees 4×12', 'Jump Squats 4×15', 'Push-Ups 4×15', 'V-Ups 4×15', 'Sprint Intervals 5×30s'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Push', exercises: ['Bench Press 4×10', 'Shoulder Press 4×10', 'Tricep Dips 3×12', 'Chest Flys 3×12'] },
        { day: 'Day 2 – Pull & Cardio', exercises: ['Pull-Ups 4×8', 'Barbell Rows 4×10', 'Bicep Curls 3×12', 'Treadmill 20min'] },
        { day: 'Day 3 – Legs & Core', exercises: ['Deadlifts 4×8', 'Bulgarian Split Squats 3×10', 'Leg Curls 3×12', 'Plank 4×45s'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Chest', exercises: ['Bench Press 4×10', 'Incline Press 3×10', 'Cable Flys 3×12', 'Push-Ups 3×15'] },
        { day: 'Day 2 – Back', exercises: ['Deadlift 4×6', 'Pull-Ups 4×8', 'Seated Rows 3×12', 'Face Pulls 3×15'] },
        { day: 'Day 3 – HIIT Cardio', exercises: ['Sprint Intervals 8×30s', 'Jump Rope 5×1min', 'Burpees 4×12', 'Box Jumps 4×10'] },
        { day: 'Day 4 – Legs', exercises: ['Squats 4×10', 'Romanian Deadlift 3×10', 'Leg Press 3×12', 'Calf Raises 4×20'] },
        { day: 'Day 5 – Shoulders & Arms', exercises: ['OHP 4×10', 'Lateral Raises 3×15', 'Bicep Curls 3×12', 'Skull Crushers 3×12'] },
      ]),
    },
    Advanced: {
      1: buildPlan([
        { day: 'Day 1 – Intense Full Body', exercises: ['Clean & Press 5×5', 'Thrusters 4×10', 'Pull-Ups 4×10', 'Kettlebell Swings 4×15', 'Battle Ropes 4×30s'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Heavy Push', exercises: ['Bench Press 5×5', 'Incline DB Press 4×8', 'OHP 4×8', 'Weighted Dips 4×10'] },
        { day: 'Day 2 – Heavy Pull', exercises: ['Deadlift 5×3', 'Weighted Pull-Ups 4×6', 'T-Bar Rows 4×8', 'Face Pulls 4×15'] },
        { day: 'Day 3 – Legs & Conditioning', exercises: ['Squat 5×5', 'Bulgarian Split Squat 4×10', 'Nordic Curls 4×6', 'Farmer Carries 4×40m'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Chest & Triceps', exercises: ['Bench Press 5×5', 'Incline DB Press 4×8', 'Cable Crossovers 3×12', 'Weighted Dips 4×10', 'Overhead Tricep Ext 3×12'] },
        { day: 'Day 2 – Back & Biceps', exercises: ['Deadlift 5×3', 'Weighted Pull-Ups 4×6', 'Barbell Rows 4×8', 'Hammer Curls 3×12', 'EZ Bar Curls 3×10'] },
        { day: 'Day 3 – HIIT & Conditioning', exercises: ['Sprint Intervals 10×20s', 'Sled Push 5×20m', 'Battle Ropes 5×30s', 'Box Jumps 4×12'] },
        { day: 'Day 4 – Legs', exercises: ['Back Squat 5×5', 'Romanian Deadlift 4×8', 'Hack Squat 3×12', 'Nordic Curls 3×6', 'Calf Raises 5×20'] },
        { day: 'Day 5 – Shoulders & Core', exercises: ['OHP 5×5', 'Arnold Press 3×10', 'Lateral Raises 4×15', 'Dragon Flags 4×8', 'Ab Wheel 4×10'] },
      ]),
    },
  },
  'Build Muscle': {
    Beginner: {
      1: buildPlan([
        { day: 'Day 1 – Full Body', exercises: ['Squats 3×10', 'Push-Ups 3×10', 'Dumbbell Rows 3×10', 'Shoulder Press 3×10', 'Plank 3×30s'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Chest & Shoulders', exercises: ['Push-Ups 4×12', 'DB Shoulder Press 3×12', 'Lateral Raises 3×12', 'Front Raises 3×12'] },
        { day: 'Day 2 – Back & Biceps', exercises: ['DB Rows 4×12', 'Bicep Curls 3×12', 'Lat Pulldowns 3×12', 'Hammer Curls 3×12'] },
        { day: 'Day 3 – Legs & Core', exercises: ['Squats 4×12', 'Lunges 3×12', 'Calf Raises 4×15', 'Plank 3×30s', 'Crunches 3×15'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Chest', exercises: ['DB Bench Press 4×10', 'Push-Ups 3×12', 'Chest Flys 3×12', 'Incline Push-Ups 3×12'] },
        { day: 'Day 2 – Back', exercises: ['DB Rows 4×10', 'Lat Pulldowns 3×12', 'Seated Cable Rows 3×12', 'Straight-Arm Pulldowns 3×12'] },
        { day: 'Day 3 – Shoulders', exercises: ['DB Shoulder Press 4×10', 'Lateral Raises 3×15', 'Front Raises 3×12', 'Rear Delt Flys 3×12'] },
        { day: 'Day 4 – Arms', exercises: ['Bicep Curls 4×12', 'Hammer Curls 3×12', 'Tricep Pushdowns 4×12', 'Skull Crushers 3×10'] },
        { day: 'Day 5 – Legs & Core', exercises: ['Squats 4×12', 'Romanian Deadlift 3×12', 'Leg Press 3×15', 'Calf Raises 4×20', 'Plank 3×45s'] },
      ]),
    },
    Intermediate: {
      1: buildPlan([
        { day: 'Day 1 – Full Body Strength', exercises: ['Deadlift 3×6', 'Bench Press 3×8', 'Barbell Rows 3×8', 'OHP 3×8', 'Squats 3×8'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Push', exercises: ['Bench Press 4×8', 'OHP 4×8', 'Incline DB Press 3×10', 'Tricep Dips 3×12', 'Lateral Raises 3×12'] },
        { day: 'Day 2 – Pull', exercises: ['Deadlift 4×6', 'Pull-Ups 4×8', 'Barbell Rows 4×8', 'Bicep Curls 3×12', 'Face Pulls 3×15'] },
        { day: 'Day 3 – Legs', exercises: ['Back Squat 4×8', 'Romanian Deadlift 3×10', 'Leg Press 3×12', 'Leg Curls 3×12', 'Calf Raises 4×20'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Chest', exercises: ['Bench Press 5×5', 'Incline Press 4×8', 'Cable Flys 3×12', 'DB Pullovers 3×12'] },
        { day: 'Day 2 – Back', exercises: ['Deadlift 4×5', 'Pull-Ups 4×8', 'Cable Rows 4×10', 'Straight-Arm Pulldowns 3×12'] },
        { day: 'Day 3 – Shoulders', exercises: ['OHP 4×8', 'Arnold Press 3×10', 'Lateral Raises 4×15', 'Rear Delt Machine 3×15'] },
        { day: 'Day 4 – Arms', exercises: ['EZ Bar Curls 4×10', 'Incline DB Curls 3×12', 'Skull Crushers 4×10', 'Cable Pushdowns 3×12'] },
        { day: 'Day 5 – Legs', exercises: ['Squats 5×5', 'Leg Press 4×10', 'Romanian Deadlift 3×10', 'Leg Curls 3×12', 'Calf Raises 5×20'] },
      ]),
    },
    Advanced: {
      1: buildPlan([
        { day: 'Day 1 – Max Effort Full Body', exercises: ['Deadlift 5×3', 'Bench Press 5×3', 'Front Squat 4×5', 'Weighted Pull-Ups 4×5', 'OHP 4×5'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Heavy Push', exercises: ['Bench Press 5×3', 'OHP 4×5', 'Weighted Dips 4×8', 'Cable Crossovers 3×12', 'Skull Crushers 4×10'] },
        { day: 'Day 2 – Heavy Pull', exercises: ['Deadlift 5×3', 'Weighted Pull-Ups 5×5', 'Pendlay Rows 4×6', 'EZ Bar Curls 4×10', 'Hammer Curls 3×12'] },
        { day: 'Day 3 – Legs', exercises: ['Back Squat 5×3', 'Front Squat 3×5', 'Romanian Deadlift 4×8', 'Nordic Curls 4×6', 'Standing Calf Raises 5×15'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Chest & Triceps', exercises: ['Bench Press 5×3', 'Incline Bench 4×6', 'Weighted Dips 4×8', 'Cable Flys 3×12', 'Overhead Tricep Ext 4×10'] },
        { day: 'Day 2 – Back & Biceps', exercises: ['Deadlift 5×3', 'Weighted Pull-Ups 5×5', 'Pendlay Rows 4×6', 'Incline DB Curls 4×10', 'Preacher Curls 3×12'] },
        { day: 'Day 3 – Shoulders', exercises: ['OHP 5×5', 'Arnold Press 4×8', 'Lateral Raises 4×15', 'Rear Delt Flys 4×12', 'Shrugs 4×12'] },
        { day: 'Day 4 – Legs', exercises: ['Back Squat 5×3', 'Romanian Deadlift 4×6', 'Hack Squat 3×10', 'Nordic Curls 4×6', 'Seated Calf Raises 5×15'] },
        { day: 'Day 5 – Arms & Core', exercises: ['EZ Bar Curls 5×8', 'Hammer Curls 4×10', 'Skull Crushers 5×8', 'Tricep Dips 4×10', 'Ab Wheel 4×10'] },
      ]),
    },
  },
  'General Fitness': {
    Beginner: {
      1: buildPlan([
        { day: 'Day 1 – Full Body', exercises: ['Squats 3×12', 'Push-Ups 3×10', 'Plank 3×30s', 'Jumping Jacks 3×20', 'Dumbbell Rows 3×10'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Strength', exercises: ['Squats 3×12', 'Push-Ups 3×12', 'DB Rows 3×12', 'Shoulder Press 3×10'] },
        { day: 'Day 2 – Cardio & Core', exercises: ['Brisk Walk/Jog 20min', 'Plank 3×30s', 'Crunches 3×15', 'Leg Raises 3×12'] },
        { day: 'Day 3 – Full Body', exercises: ['Lunges 3×12', 'Dips 3×10', 'Lat Pulldowns 3×12', 'Calf Raises 3×15', 'Bicycle Crunches 3×20'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Upper Strength', exercises: ['DB Bench Press 3×12', 'DB Rows 3×12', 'Shoulder Press 3×10', 'Bicep Curls 3×12'] },
        { day: 'Day 2 – Cardio', exercises: ['Jog 20-30min', 'Jump Rope 5×1min', 'High Knees 3×30s'] },
        { day: 'Day 3 – Lower Body', exercises: ['Squats 4×12', 'Lunges 3×12', 'Glute Bridges 3×15', 'Calf Raises 3×20'] },
        { day: 'Day 4 – Core & Flexibility', exercises: ['Plank 4×30s', 'Dead Bug 3×10', 'Russian Twists 3×20', 'Hip Flexor Stretch 3×30s'] },
        { day: 'Day 5 – Full Body', exercises: ['Deadlift 3×10', 'Push-Ups 3×12', 'Pull-Ups 3×6', 'Goblet Squats 3×12'] },
      ]),
    },
    Intermediate: {
      1: buildPlan([
        { day: 'Day 1 – Full Body', exercises: ['Deadlift 3×8', 'Bench Press 3×8', 'Pull-Ups 3×8', 'Squats 3×10', 'OHP 3×8'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Strength A', exercises: ['Squat 4×6', 'Bench Press 4×8', 'Barbell Row 4×8', 'OHP 3×10'] },
        { day: 'Day 2 – Cardio & Mobility', exercises: ['Run 30min', 'Hip 90-90 Stretch', 'Thoracic Rotations', 'Pigeon Pose', 'Foam Roll'] },
        { day: 'Day 3 – Strength B', exercises: ['Deadlift 4×5', 'Pull-Ups 4×8', 'Incline Press 3×10', 'Bulgarian Split Squat 3×10'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Push', exercises: ['Bench Press 4×8', 'OHP 3×10', 'Incline DB Press 3×10', 'Tricep Dips 3×12'] },
        { day: 'Day 2 – Pull', exercises: ['Deadlift 3×6', 'Pull-Ups 4×8', 'Cable Rows 3×12', 'Bicep Curls 3×12'] },
        { day: 'Day 3 – Cardio', exercises: ['Run 5K', 'Jump Rope 10min', 'Cycling 20min'] },
        { day: 'Day 4 – Legs', exercises: ['Squats 4×8', 'Romanian Deadlift 3×10', 'Leg Press 3×12', 'Calf Raises 4×15'] },
        { day: 'Day 5 – Core & Mobility', exercises: ['Plank 4×45s', 'Dead Bug 3×12', 'Ab Wheel 3×10', 'Full Body Stretching 15min'] },
      ]),
    },
    Advanced: {
      1: buildPlan([
        { day: 'Day 1 – Full Body Power', exercises: ['Power Clean 4×4', 'Bench Press 4×5', 'Front Squat 4×5', 'Weighted Pull-Ups 4×6', 'Farmer Carries 4×40m'] },
      ]),
      3: buildPlan([
        { day: 'Day 1 – Strength', exercises: ['Squat 5×5', 'Bench Press 5×5', 'Barbell Row 5×5'] },
        { day: 'Day 2 – Conditioning', exercises: ['Run 5K or Cycle 45min', 'Kettlebell Swings 5×15', 'Box Jumps 4×10', 'Battle Ropes 4×30s'] },
        { day: 'Day 3 – Strength B', exercises: ['Deadlift 5×3', 'OHP 4×6', 'Weighted Pull-Ups 5×5', 'Bulgarian Split Squat 4×8'] },
      ]),
      5: buildPlan([
        { day: 'Day 1 – Strength Push', exercises: ['Bench Press 5×3', 'OHP 4×5', 'Weighted Dips 4×8', 'Incline DB Press 3×10'] },
        { day: 'Day 2 – Strength Pull', exercises: ['Deadlift 5×3', 'Weighted Pull-Ups 5×5', 'Pendlay Rows 4×6', 'Face Pulls 4×15'] },
        { day: 'Day 3 – Conditioning', exercises: ['Run 5K', 'Sprint Intervals 8×30s', 'Sled Push 4×20m'] },
        { day: 'Day 4 – Legs', exercises: ['Back Squat 5×3', 'Romanian Deadlift 4×6', 'Hack Squat 3×10', 'Nordic Curls 4×6'] },
        { day: 'Day 5 – Weak Points & Core', exercises: ['Targeted Isolation Work', 'Ab Wheel 5×10', 'Dragon Flags 4×8', 'Farmer Carries 4×40m'] },
      ]),
    },
  },
};

const QUESTIONS = [
  { key: 'name', label: "What's your name?", placeholder: 'Enter your name', type: 'text' },
  { key: 'goal', label: 'What is your fitness goal?', type: 'choice', options: ['Lose Weight', 'Build Muscle', 'General Fitness'] },
  { key: 'level', label: 'What is your experience level?', type: 'choice', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { key: 'days', label: 'How many days per week can you train?', type: 'choice', options: ['1', '2', '3', '4', '5', '6'] },
];

// Module-level cache so images aren't re-fetched across re-renders
const imageCache = {};

function cleanExerciseName(name) {
  return name
    .replace(/\s*\d+[×xX]\d+\s*/g, '')
    .replace(/\s*\d+min\s*/g, '')
    .replace(/\s*\d+s\b/g, '')
    .replace(/^DB\s/i, 'Dumbbell ')
    .replace(/^BB\s/i, 'Barbell ')
    .replace(/\bOHP\b/g, 'Overhead Press')
    .replace(/\bEZ Bar\b/gi, 'Barbell')
    .trim();
}

function getExerciseEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes('squat') || n.includes('lunge') || n.includes('leg') || n.includes('calf') || n.includes('nordic')) return '🦵';
  if (n.includes('bench') || n.includes('chest') || n.includes('push') || n.includes('dip') || n.includes('fly')) return '💪';
  if (n.includes('deadlift') || n.includes('row') || n.includes('pull') || n.includes('lat')) return '🏋️';
  if (n.includes('shoulder') || n.includes('press') || n.includes('lateral') || n.includes('raise') || n.includes('shrug')) return '🏋️';
  if (n.includes('curl') || n.includes('bicep') || n.includes('tricep') || n.includes('skull') || n.includes('kickback')) return '💪';
  if (n.includes('plank') || n.includes('crunch') || n.includes('ab') || n.includes('core') || n.includes('wheel') || n.includes('dragon')) return '🎯';
  if (n.includes('run') || n.includes('jog') || n.includes('sprint') || n.includes('cardio') || n.includes('jump') || n.includes('rope') || n.includes('burpee') || n.includes('bike') || n.includes('cycling')) return '🏃';
  if (n.includes('stretch') || n.includes('yoga') || n.includes('foam') || n.includes('pigeon') || n.includes('mobility')) return '🧘';
  return '🏋️';
}

function ExerciseImage({ exerciseName }) {
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const clean = cleanExerciseName(exerciseName);

    if (imageCache[clean] !== undefined) {
      setUri(imageCache[clean]);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const searchRes = await fetch(
          `https://wger.de/api/v2/exercise/?format=json&language=2&name=${encodeURIComponent(clean)}&limit=5`
        );
        const searchData = await searchRes.json();
        if (searchData.results?.length > 0) {
          const baseId = searchData.results[0].exercise_base;
          const imgRes = await fetch(
            `https://wger.de/api/v2/exerciseimage/?format=json&exercise_base=${baseId}&limit=1`
          );
          const imgData = await imgRes.json();
          const found = imgData.results?.[0]?.image ?? null;
          imageCache[clean] = found;
          if (mounted.current) setUri(found);
        } else {
          imageCache[clean] = null;
        }
      } catch {
        imageCache[clean] = null;
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();

    return () => { mounted.current = false; };
  }, [exerciseName]);

  if (loading) {
    return (
      <View style={styles.exImgBox}>
        <ActivityIndicator size="small" color={COLORS.accent} />
      </View>
    );
  }
  if (!uri) {
    return (
      <View style={styles.exImgBox}>
        <Text style={styles.exImgEmoji}>{getExerciseEmoji(exerciseName)}</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={styles.exImg} resizeMode="contain" />;
}

function BarChart({ data }) {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyChart}>No weight logged yet. Tap "+ Log Weight" to start tracking!</Text>;
  }
  const weights = data.map(d => parseFloat(d.weight));
  const maxW = Math.max(...weights);
  const minW = Math.min(...weights);
  const range = maxW === minW ? 1 : maxW - minW;
  const MAX_BAR = 120;
  const MIN_BAR = 24;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.chart}>
        {data.map((entry, i) => {
          const barHeight = ((parseFloat(entry.weight) - minW) / range) * (MAX_BAR - MIN_BAR) + MIN_BAR;
          const isLatest = i === data.length - 1;
          return (
            <View key={i} style={styles.barCol}>
              <Text style={styles.barWeightLabel}>{entry.weight}</Text>
              <View style={[styles.bar, { height: barHeight }, isLatest && styles.barLatest]} />
              <Text style={styles.weekLabel}>Wk {entry.week}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function LogModal({ visible, exercise, onSave, onCancel }) {
  const [weightInput, setWeightInput] = useState('');

  function handleSave() {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) {
      Alert.alert('Invalid', 'Please enter a valid weight.');
      return;
    }
    onSave(weightInput);
    setWeightInput('');
  }

  function handleCancel() {
    setWeightInput('');
    onCancel();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Weight</Text>
            <Text style={styles.modalSubtitle}>{exercise}</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs or kg)"
              placeholderTextColor={COLORS.muted}
              keyboardType="decimal-pad"
              value={weightInput}
              onChangeText={setWeightInput}
              autoFocus
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default function Root() {
  const [textVal, setTextVal] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [plan, setPlan] = useState(null);
  const [screen, setScreen] = useState('quiz');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [logs, setLogs] = useState({});
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [loggingExercise, setLoggingExercise] = useState(null);

  function logKey(dayTitle, exercise) {
    return `${dayTitle}|${exercise}`;
  }

  function handleAnswer(value) {
    const key = QUESTIONS[step].key;
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    setTextVal('');

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const goalPlan = WORKOUT_PLANS[updated.goal]?.[updated.level];
      if (goalPlan) {
        const closestDay = getClosestDays(goalPlan, parseInt(updated.days));
        setPlan(goalPlan[closestDay]);
        setScreen('plan');
      }
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setPlan(null);
    setTextVal('');
    setScreen('quiz');
    setSelectedDay(null);
    setSelectedExercise(null);
    setLogs({});
  }

  function openLogModal(exercise) {
    setLoggingExercise(exercise);
    setLogModalVisible(true);
  }

  function saveLog(weight) {
    const key = logKey(selectedDay.day, loggingExercise);
    const existing = logs[key] || [];
    setLogs(prev => ({ ...prev, [key]: [...existing, { week: existing.length + 1, weight }] }));
    setLogModalVisible(false);
  }

  const question = QUESTIONS[step];

  // ── Quiz Screen ──────────────────────────────────────────
  if (screen === 'quiz') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Workout Tracker</Text>
        <View style={styles.progress}>
          {QUESTIONS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]} />
          ))}
        </View>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.label}</Text>
          {question.type === 'text' && (
            <>
              <TextInput
                style={styles.input}
                placeholder={question.placeholder}
                placeholderTextColor={COLORS.muted}
                value={textVal}
                onChangeText={setTextVal}
                returnKeyType="next"
                autoFocus
              />
              <TouchableOpacity style={styles.button} onPress={() => { if (textVal.trim()) handleAnswer(textVal.trim()); }}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
          {question.type === 'choice' && (
            <View style={styles.choices}>
              {question.options.map(opt => (
                <TouchableOpacity key={opt} style={styles.choiceBtn} onPress={() => handleAnswer(opt)}>
                  <Text style={styles.choiceText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ── Plan Overview Screen ─────────────────────────────────
  if (screen === 'plan') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Workout Plan</Text>
        <Text style={styles.subtitle}>{answers.name}'s {answers.goal} Plan · {answers.level}</Text>
        <FlatList
          data={plan}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => { setSelectedDay(item); setScreen('day'); }}>
              <View style={styles.cardRow}>
                <Text style={styles.dayTitle}>{item.day}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
              <Text style={styles.exerciseCount}>{item.exercises.length} exercises</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity style={[styles.button, { marginTop: 8, marginBottom: 40 }]} onPress={restart}>
              <Text style={styles.buttonText}>Start Over</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }

  // ── Day Detail Screen ────────────────────────────────────
  if (screen === 'day') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('plan')} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back to Plan</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedDay.day}</Text>
        <FlatList
          data={selectedDay.exercises}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => {
            const entryCount = (logs[logKey(selectedDay.day, item)] || []).length;
            return (
              <View style={styles.exerciseCard}>
                <View style={styles.exerciseCardTop}>
                  <ExerciseImage exerciseName={item} />
                  <View style={styles.exerciseCardInfo}>
                    <Text style={styles.exerciseName}>{item}</Text>
                    <Text style={styles.logCount}>
                      {entryCount > 0 ? `${entryCount} week${entryCount > 1 ? 's' : ''} logged` : 'No logs yet'}
                    </Text>
                  </View>
                </View>
                <View style={styles.exerciseBtns}>
                  <TouchableOpacity style={styles.logBtn} onPress={() => openLogModal(item)}>
                    <Text style={styles.logBtnText}>+ Log Weight</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.logBtn, styles.progressBtn]}
                    onPress={() => { setSelectedExercise(item); setScreen('progress'); }}
                  >
                    <Text style={styles.logBtnText}>See Progress</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
        <LogModal
          visible={logModalVisible}
          exercise={loggingExercise}
          onSave={saveLog}
          onCancel={() => setLogModalVisible(false)}
        />
      </View>
    );
  }

  // ── Progress Screen ──────────────────────────────────────
  if (screen === 'progress') {
    const data = logs[logKey(selectedDay.day, selectedExercise)] || [];
    const latest = data.length > 0 ? data[data.length - 1].weight : null;
    const first = data.length > 1 ? data[0].weight : null;
    const change = first && latest ? (parseFloat(latest) - parseFloat(first)).toFixed(1) : null;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('day')} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back to {selectedDay.day.split(' – ')[0]}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>{selectedExercise}</Text>
        <View style={styles.progressImgRow}>
          <ExerciseImage exerciseName={selectedExercise} />
        </View>

        {data.length > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{latest}</Text>
              <Text style={styles.statLabel}>Latest</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{data.length}</Text>
              <Text style={styles.statLabel}>Weeks</Text>
            </View>
            {change !== null && (
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: parseFloat(change) >= 0 ? COLORS.success : COLORS.accent }]}>
                  {parseFloat(change) >= 0 ? '+' : ''}{change}
                </Text>
                <Text style={styles.statLabel}>Total Change</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weight Over Time</Text>
          <BarChart data={data} />
        </View>

        <FlatList
          data={[...data].reverse()}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.logRow}>
              <Text style={styles.logWeek}>Week {item.week}</Text>
              <Text style={styles.logWeight}>{item.weight}</Text>
            </View>
          )}
          ListHeaderComponent={data.length > 0 ? <Text style={styles.sectionLabel}>Log History</Text> : null}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity style={[styles.logBtn, styles.floatBtn]} onPress={() => openLogModal(selectedExercise)}>
          <Text style={styles.logBtnText}>+ Log This Week</Text>
        </TouchableOpacity>

        <LogModal
          visible={logModalVisible}
          exercise={loggingExercise}
          onSave={saveLog}
          onCancel={() => setLogModalVisible(false)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.input },
  dotActive: { backgroundColor: COLORS.accent, width: 24 },
  dotDone: { backgroundColor: COLORS.success },
  questionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
  },
  questionText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  choices: { gap: 10 },
  choiceBtn: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  choiceText: { color: COLORS.text, fontSize: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayTitle: { color: COLORS.accent, fontWeight: 'bold', fontSize: 15, flex: 1 },
  chevron: { color: COLORS.muted, fontSize: 24 },
  exerciseCount: { color: COLORS.muted, fontSize: 13, marginTop: 4 },
  backBtn: { marginBottom: 12 },
  backText: { color: COLORS.accent, fontSize: 15 },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  exerciseCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  exerciseCardInfo: { flex: 1 },
  exImgBox: { width: 80, height: 60, borderRadius: 8, backgroundColor: COLORS.input, justifyContent: 'center', alignItems: 'center' },
  exImgEmoji: { fontSize: 28 },
  exImg: { width: 80, height: 60, borderRadius: 8 },
  progressImgRow: { alignItems: 'center', marginBottom: 16 },
  exerciseName: { color: COLORS.text, fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  logCount: { color: COLORS.muted, fontSize: 12, marginBottom: 10 },
  exerciseBtns: { flexDirection: 'row', gap: 8 },
  logBtn: {
    flex: 1,
    backgroundColor: COLORS.input,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  progressBtn: {
    backgroundColor: COLORS.success + '22',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  logBtnText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  floatBtn: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flex: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    padding: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { color: COLORS.text, fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  modalSubtitle: { color: COLORS.muted, fontSize: 14, marginBottom: 16 },
  cancelBtn: { marginTop: 10, alignItems: 'center', padding: 10 },
  cancelText: { color: COLORS.muted, fontSize: 15 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  chartContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: { color: COLORS.text, fontWeight: 'bold', fontSize: 14, marginBottom: 12 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    gap: 8,
    paddingBottom: 4,
  },
  barCol: { alignItems: 'center', width: 52 },
  barWeightLabel: { color: COLORS.muted, fontSize: 10, marginBottom: 4 },
  bar: { width: 36, backgroundColor: COLORS.accent, borderRadius: 4 },
  barLatest: { backgroundColor: COLORS.success },
  weekLabel: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  emptyChart: { color: COLORS.muted, textAlign: 'center', fontSize: 13, padding: 16 },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  logWeek: { color: COLORS.muted, fontSize: 14 },
  logWeight: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  sectionLabel: { color: COLORS.text, fontWeight: 'bold', fontSize: 15, marginBottom: 8 },
});
