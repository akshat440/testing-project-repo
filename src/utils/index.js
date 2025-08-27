// src/utils/index.js - Utility functions
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateDNASequence = (sequence) => {
  const validChars = /^[ATGCN\s\n\r]+$/i;
  return validChars.test(sequence);
};

export const cleanDNASequence = (sequence) => {
  return sequence.replace(/[\s\n\r]/g, '').toUpperCase();
};

export const createFastaFromSequence = (sequence, id = 'User_Sequence') => {
  const cleanSeq = cleanDNASequence(sequence);
  return `>${id}\n${cleanSeq}`;
};

export const parseFastaContent = (content) => {
  const sequences = [];
  const lines = content.split('\n');
  let currentSequence = { id: '', sequence: '' };
  
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('>')) {
      if (currentSequence.id && currentSequence.sequence) {
        sequences.push(currentSequence);
      }
      currentSequence = { id: line.substring(1), sequence: '' };
    } else if (line) {
      currentSequence.sequence += line;
    }
  }
  
  if (currentSequence.id && currentSequence.sequence) {
    sequences.push(currentSequence);
  }
  
  return sequences;
};

export const downloadFile = (content, filename, contentType = 'application/json') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const showNotification = (message, type = 'info', duration = 5000) => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove
  const timeoutId = setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, duration);
  
  // Manual close
  notification.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(timeoutId);
    notification.remove();
  });
};

export const getModelTypeColor = (type) => {
  const colors = {
    'ensemble': 'text-green-400',
    'distance_based': 'text-blue-400',
    'boosting': 'text-purple-400',
    'deep_learning': 'text-red-400',
    'traditional': 'text-yellow-400',
  };
  return colors[type] || 'text-gray-400';
};

export const getModelTypeIcon = (type) => {
  const icons = {
    'ensemble': '🌳',
    'distance_based': '📏',
    'boosting': '🚀',
    'deep_learning': '🧠',
    'traditional': '⚙️',
  };
  return icons[type] || '🔬';
};

export const calculateAccuracy = (truePositive, trueNegative, falsePositive, falseNegative) => {
  const total = truePositive + trueNegative + falsePositive + falseNegative;
  if (total === 0) return 0;
  return ((truePositive + trueNegative) / total) * 100;
};

export const calculatePrecision = (truePositive, falsePositive) => {
  const total = truePositive + falsePositive;
  if (total === 0) return 0;
  return (truePositive / total) * 100;
};

export const calculateRecall = (truePositive, falseNegative) => {
  const total = truePositive + falseNegative;
  if (total === 0) return 0;
  return (truePositive / total) * 100;
};

export const calculateF1Score = (precision, recall) => {
  if (precision + recall === 0) return 0;
  return (2 * precision * recall) / (precision + recall);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// File validation
export const validateFile = (file, allowedTypes = ['.fasta', '.fas', '.fa', '.fna', '.txt'], maxSize = 100 * 1024 * 1024) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }
  
  // Check file type
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedTypes.some(type => fileName.endsWith(type));
  
  if (!hasValidExtension) {
    errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: ${formatFileSize(maxSize)}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};