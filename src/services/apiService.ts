
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface TestSection {
  type: string;
  questions: {
    question_id: string;
    audio_file: string;
  }[];
}

export interface TestStructure {
  [testId: string]: {
    type: string;
    qid: string[][];
  }[];
}

export interface TestData {
  test_id: string;
  sections: TestSection[];
}

export const fetchTestStructure = async (): Promise<TestStructure> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_test_structure`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test structure:', error);
    throw error;
  }
};

export const fetchTestData = async (testId: string): Promise<TestData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_test/${testId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching test ${testId}:`, error);
    throw error;
  }
};

export const fetchSectionQuestions = async (testId: string, sectionType: string): Promise<{questions: {question_id: string, audio_file: string}[]}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_question/${testId}/${sectionType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching questions for ${testId}/${sectionType}:`, error);
    throw error;
  }
};

export const getAudioUrl = (questionId: string): string => {
  return `${API_BASE_URL}/get_audio/${questionId}`;
};

export const saveRecording = async (questionId: string, audioBlob: Blob): Promise<void> => {
  try {
    // Create a directory named 'answers' if it doesn't exist
    // This would typically be handled by the backend
    
    // Create a file name with the question ID
    const fileName = `answers/${questionId}.webm`;
    
    // In a real app, you'd send this to your backend:
    // const formData = new FormData();
    // formData.append('audio', audioBlob, fileName);
    // await axios.post(`${API_BASE_URL}/save_recording`, formData);
    
    // For now, we'll just log it since we can't write files directly from the browser
    console.log(`Recording saved for question ${questionId}`, audioBlob);
  } catch (error) {
    console.error('Error saving recording:', error);
    throw error;
  }
};
