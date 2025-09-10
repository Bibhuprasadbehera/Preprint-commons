import React from 'react';
import CitationScatterChart from './components/citationCharts/CitationScatterChart';
import MapContainer from './components/ui/MapContainer/MapContainer';
import './styles/index.css';

// Mock data with different date ranges to test the citation chart fix
const mockDataSubject1 = [
  { PPC_Id: '1', preprint_title: 'Early Research Paper', publication_date: '2018-03-15', total_citation: 45 },
  { PPC_Id: '2', preprint_title: 'Mid Period Study', publication_date: '2019-07-22', total_citation: 78 },
  { PPC_Id: '3', preprint_title: 'Recent Analysis', publication_date: '2020-11-08', total_citation: 123 },
  { PPC_Id: '4', preprint_title: 'Latest Findings', publication_date: '2021-02-14', total_citation: 89 }
];

const mockDataSubject2 = [
  { PPC_Id: '5', preprint_title: 'Very Recent Study', publication_date: '2022-05-10', total_citation: 234 },
  { PPC_Id: '6', preprint_title: 'Current Research', publication_date: '2023-01-20', total_citation: 156 },
  { PPC_Id: '7', preprint_title: 'Latest Publication', publication_date: '2023-08-15', total_citation: 67 },
  { PPC_Id: '8', preprint_title: 'Most Recent Work', publication_date: '2024-01-05', total_citation: 23 }
];

const App = () => {
  const [currentData, setCurrentData] = React.useState(mockDataSubject1);
  const [loading, setLoading] = React.useState(false);

  const switchToSubject1 = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentData(mockDataSubject1);
      setLoading(false);
    }, 500);
  };

  const switchToSubject2 = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentData(mockDataSubject2);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <h1>Fixed Components Demo</h1>
      
      {/* Citation Chart Fix Demo */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Citation Impact Visualization - Axis Scaling Fix</h2>
        <p>Test the fix by switching between subjects with different year ranges:</p>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={switchToSubject1}
            style={{ 
              marginRight: '10px', 
              padding: '10px 20px', 
              backgroundColor: currentData === mockDataSubject1 ? '#3B82F6' : '#E5E7EB',
              color: currentData === mockDataSubject1 ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Subject 1 (2018-2021)
          </button>
          <button 
            onClick={switchToSubject2}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentData === mockDataSubject2 ? '#3B82F6' : '#E5E7EB',
              color: currentData === mockDataSubject2 ? 'white' : 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Subject 2 (2022-2024)
          </button>
        </div>

        <div style={{ 
          border: '1px solid #E5E7EB', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: 'white'
        }}>
          <h3>Citation Impact Chart</h3>
          <p>The chart should automatically adjust its axis ranges when switching between subjects.</p>
          <CitationScatterChart data={currentData} loading={loading} />
        </div>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          <h4>Citation Chart Fix Details:</h4>
          <ul>
            <li>✅ Chart now detects when data has significantly different date ranges</li>
            <li>✅ Automatically resets zoom state when switching to data with different ranges</li>
            <li>✅ Preserves zoom level when data ranges are similar</li>
            <li>✅ Improved grid line calculation for better readability</li>
            <li>✅ Added proper padding to axis ranges for better visualization</li>
          </ul>
        </div>
      </section>

      {/* Map Fix Demo */}
      <section style={{ marginBottom: '40px' }}>
        <h2>World Map - Country Names Removal Fix</h2>
        <p>The map now shows country data without visible country names, but hover still works:</p>
        
        <div style={{ 
          border: '1px solid #E5E7EB', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: 'white',
          height: '600px'
        }}>
          <MapContainer 
            title="Global Preprint Distribution Map - Fixed"
            showStats={true}
            statsData={[
              { number: "300,000+", label: "Preprints Indexed" },
              { number: "50+", label: "Countries Contributing" },
              { number: "1,000+", label: "Institutions Tracked" }
            ]}
          />
        </div>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#6B7280' }}>
          <h4>Map Fix Details:</h4>
          <ul>
            <li>✅ Removed visible country names from the map display</li>
            <li>✅ Preserved hover functionality - hover over countries to see names and data</li>
            <li>✅ Toggle button now uses left/right visual switch instead of text</li>
            <li>✅ Year slider works with both modes</li>
            <li>✅ Tooltip shows country name and preprint count on hover</li>
            <li>✅ Click on countries to search papers from that country</li>
            <li>✅ Added country parameter handling in ExplorePage</li>
          </ul>
        </div>
      </section>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#F3F4F6', borderRadius: '8px' }}>
        <h3>How to Test:</h3>
        <ol>
          <li><strong>Citation Chart:</strong> Switch between Subject 1 and Subject 2 buttons to see automatic axis adjustment</li>
          <li><strong>World Map:</strong> Hover over countries to see names and data (no visible labels)</li>
          <li><strong>Map Toggle:</strong> Use the left/right toggle switch to switch between "Year-wise" and "Cumulative" modes</li>
          <li><strong>Map Slider:</strong> Use the year slider to filter data by specific years</li>
          <li><strong>Map Click:</strong> Click on countries with data to search papers from that country (opens console for debugging)</li>
        </ol>
      </div>
    </div>
  );
};

export default App;