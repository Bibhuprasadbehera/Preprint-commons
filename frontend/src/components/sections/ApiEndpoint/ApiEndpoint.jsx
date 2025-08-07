import React, { useState } from 'react';
import Card from '../../ui/Card/Card';
import CodeBlock from '../../ui/CodeBlock/CodeBlock';
import Button from '../../ui/Button/Button';
import styles from './ApiEndpoint.module.css';

const ApiEndpoint = ({ 
  method, 
  endpoint, 
  description, 
  parameters = [], 
  response 
}) => {
  const [showExample, setShowExample] = useState(false);

  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case 'GET': return '#10b981';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const generateCurlExample = () => {
    let curl = `curl -X ${method} "http://localhost:8000${endpoint}"`;
    
    if (parameters.length > 0) {
      const queryParams = parameters
        .filter(p => p.required)
        .map(p => `${p.name}=${p.type === 'string' ? 'example' : '2023'}`)
        .join('&');
      
      if (queryParams) {
        curl = curl.replace(endpoint, `${endpoint}?${queryParams}`);
      }
    }
    
    curl += ' \\\n  -H "Content-Type: application/json"';
    return curl;
  };

  return (
    <Card className={styles.endpointCard}>
      <div className={styles.endpointHeader}>
        <div className={styles.endpointInfo}>
          <div className={styles.methodBadge} style={{ backgroundColor: getMethodColor(method) }}>
            {method.toUpperCase()}
          </div>
          <code className={styles.endpointPath}>{endpoint}</code>
        </div>
        <Button 
          variant="ghost" 
          size="small"
          onClick={() => setShowExample(!showExample)}
        >
          {showExample ? 'Hide Example' : 'Show Example'}
        </Button>
      </div>

      <div className={styles.endpointContent}>
        <p className={styles.description}>{description}</p>

        {parameters.length > 0 && (
          <div className={styles.parameters}>
            <h4 className={styles.sectionTitle}>Parameters</h4>
            <div className={styles.parametersList}>
              {parameters.map((param, index) => (
                <div key={index} className={styles.parameter}>
                  <div className={styles.parameterHeader}>
                    <code className={styles.parameterName}>{param.name}</code>
                    <span className={styles.parameterType}>{param.type}</span>
                    {param.required && (
                      <span className={styles.requiredBadge}>required</span>
                    )}
                  </div>
                  <p className={styles.parameterDescription}>{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showExample && (
          <div className={styles.examples}>
            <div className={styles.example}>
              <h4 className={styles.sectionTitle}>cURL Example</h4>
              <CodeBlock 
                code={generateCurlExample()}
                language="bash"
                showCopy={true}
              />
            </div>

            <div className={styles.example}>
              <h4 className={styles.sectionTitle}>Response Example</h4>
              <CodeBlock 
                code={JSON.stringify(response, null, 2)}
                language="json"
                showCopy={true}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApiEndpoint;