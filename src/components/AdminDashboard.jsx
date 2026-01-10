import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dataResponse, statsResponse] = await Promise.all([
        fetch('/api/get-all-choices'),
        fetch('/api/stats')
      ]);

      const dataResult = await dataResponse.json();
      const statsResult = await statsResponse.json();

      if (dataResult.success && statsResult.success) {
        setData(dataResult.data);
        setStats(statsResult.stats);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    window.open('/api/export-csv', '_blank');
  };

  const exportJSON = () => {
    window.open('/api/export-json', '_blank');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>⚠️ {error}</h2>
          <button onClick={loadData} style={styles.button}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 User Typography Choices - Admin Dashboard</h1>

      {/* Controls */}
      <div style={styles.controls}>
        <button onClick={loadData} style={styles.button}>
          🔄 Refresh Data
        </button>
        <button onClick={exportCSV} style={{...styles.button, ...styles.secondaryButton}}>
          📥 Export CSV
        </button>
        <button onClick={exportJSON} style={{...styles.button, ...styles.secondaryButton}}>
          📥 Export JSON
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total Entries</h3>
            <div style={styles.statValue}>{stats.totalEntries || 0}</div>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Average Font Size</h3>
            <div style={styles.statValue}>
              {stats.averageFontSize ? `${stats.averageFontSize}px` : '-'}
            </div>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Average Leading</h3>
            <div style={styles.statValue}>{stats.averageLeading || '-'}</div>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Most Popular Font</h3>
            <div style={{...styles.statValue, fontSize: '1.2rem'}}>
              {stats.popularFonts[0]?.specific_font || '-'}
            </div>
          </div>
        </div>
      )}

      {/* Font Categories Chart */}
      {stats && stats.fontCategories && stats.fontCategories.length > 0 && (
        <div style={styles.section}>
          <h2>📈 Font Category Distribution</h2>
          <div style={styles.chartContainer}>
            {stats.fontCategories.map((cat) => {
              const max = Math.max(...stats.fontCategories.map(c => c.count));
              const width = (cat.count / max) * 300;
              return (
                <div key={cat.font_category} style={styles.barContainer}>
                  <div style={styles.barLabel}>{cat.font_category}</div>
                  <div style={{...styles.barFill, width: `${width}px`}}>
                    {cat.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Fonts Chart */}
      {stats && stats.popularFonts && stats.popularFonts.length > 0 && (
        <div style={styles.section}>
          <h2>🔤 Most Popular Fonts</h2>
          <div style={styles.chartContainer}>
            {stats.popularFonts.slice(0, 10).map((font) => {
              const max = Math.max(...stats.popularFonts.map(f => f.count));
              const width = (font.count / max) * 300;
              return (
                <div key={font.specific_font} style={styles.barContainer}>
                  <div style={styles.barLabel}>{font.specific_font}</div>
                  <div style={{...styles.barFill, width: `${width}px`}}>
                    {font.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Colors */}
      {stats && stats.popularColorSchemes && stats.popularColorSchemes.length > 0 && (
        <div style={styles.section}>
          <h2>🎨 Popular Color Schemes</h2>
          <div style={styles.chartContainer}>
            {stats.popularColorSchemes.map((color, idx) => (
              <div key={idx} style={styles.barContainer}>
                <div style={styles.barLabel}>
                  <span style={{...styles.colorPreview, backgroundColor: color.text_color}}></span>
                  {color.text_color} on{' '}
                  <span style={{...styles.colorPreview, backgroundColor: color.bg_color}}></span>
                  {color.bg_color}
                </div>
                <div style={{...styles.barFill, width: `${color.count * 50}px`}}>
                  {color.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div style={styles.section}>
        <h2>📋 All User Choices ({data.length} entries)</h2>
        {data.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No data yet. Users need to complete the typography quiz first.
          </p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Font</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Leading</th>
                  <th style={styles.th}>Colors</th>
                  <th style={styles.th}>Session ID</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} style={styles.tr}>
                    <td style={styles.td}>{row.id}</td>
                    <td style={styles.td}>
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td style={styles.td}>{row.font_category}</td>
                    <td style={styles.td}>
                      <strong>{row.specific_font}</strong>
                    </td>
                    <td style={styles.td}>{row.font_size}px</td>
                    <td style={styles.td}>{row.leading}</td>
                    <td style={styles.td}>
                      <span style={{...styles.colorPreview, backgroundColor: row.text_color}}></span>
                      {row.text_color}
                      <br />
                      <span style={{...styles.colorPreview, backgroundColor: row.bg_color}}></span>
                      {row.bg_color}
                    </td>
                    <td style={{...styles.td, fontSize: '0.8rem', color: '#666'}}>
                      {row.session_id ? row.session_id.substring(0, 20) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  title: {
    color: '#333',
    marginBottom: '30px',
    fontSize: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '1.2rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '30px',
    borderRadius: '5px',
    border: '1px solid #f5c6cb',
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statLabel: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 10px 0',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  chartContainer: {
    marginTop: '20px',
  },
  barContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  barLabel: {
    minWidth: '150px',
    fontWeight: '500',
  },
  barFill: {
    height: '30px',
    backgroundColor: '#007bff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    color: 'white',
    fontSize: '0.9rem',
    marginRight: '10px',
  },
  colorPreview: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginRight: '5px',
    verticalAlign: 'middle',
  },
  tableContainer: {
    overflowX: 'auto',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '2px solid #dee2e6',
  },
  td: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
  },
  tr: {
    transition: 'background-color 0.2s',
  },
};

export default AdminDashboard;