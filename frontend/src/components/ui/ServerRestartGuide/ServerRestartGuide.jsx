import React, { useState } from 'react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import styles from './ServerRestartGuide.module.css';

const ServerRestartGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Stop Current Server",
      description: "If the FastAPI server is running, stop it first",
      commands: ["Press Ctrl+C in the terminal running the server"],
      icon: "🛑"
    },
    {
      title: "Navigate to Project Directory",
      description: "Make sure you're in the correct directory",
      commands: ["cd /path/to/your/project", "ls -la  # Should see main.py and ppc.db"],
      icon: "📁"
    },
    {
      title: "Verify Files Exist",
      description: "Check that required files are present",
      commands: ["ls main.py ppc.db  # Both files should exist"],
      icon: "✅"
    },
    {
      title: "Start Updated Server",
      description: "Run the server with the new citation endpoints",
      commands: [
        "python main.py",
        "# OR alternatively:",
        "uvicorn main:app --reload --port 8000"
      ],
      icon: "🚀"
    },
    {
      title: "Verify Server Started",
      description: "Check that the server is running correctly",
      commands: ["# Look for: 'Uvicorn running on http://127.0.0.1:8000'"],
      icon: "🔍"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const copyToClipboard = (command) => {
    navigator.clipboard.writeText(command.replace(/^# .*$/gm, '').trim());
  };

  return (
    <Card className={styles.guide}>
      <Card.Header>
        <div className={styles.header}>
          <h3 className={styles.title}>🔧 Server Restart Guide</h3>
          {onClose && (
            <Button variant="ghost" size="small" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </Card.Header>
      
      <Card.Content>
        <div className={styles.stepContent}>
          <div className={styles.stepHeader}>
            <span className={styles.stepIcon}>{steps[currentStep].icon}</span>
            <h4 className={styles.stepTitle}>{steps[currentStep].title}</h4>
          </div>
          
          <p className={styles.stepDescription}>
            {steps[currentStep].description}
          </p>
          
          <div className={styles.commandList}>
            {steps[currentStep].commands.map((command, index) => (
              <div key={index} className={styles.commandItem}>
                <code className={styles.command}>{command}</code>
                {!command.startsWith('#') && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => copyToClipboard(command)}
                    className={styles.copyButton}
                  >
                    📋
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.navigation}>
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← Previous
          </Button>
          
          <div className={styles.stepIndicators}>
            {steps.map((_, index) => (
              <button
                key={index}
                className={`${styles.stepIndicator} ${
                  index === currentStep ? styles.active : ''
                } ${index < currentStep ? styles.completed : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Next →
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ServerRestartGuide;