import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchIssues = async (projectKey, startDate, endDate, labels) => {
  const response = await axios.get(`${API_BASE_URL}/jira/issues`, {
    params: { projectKey, startDate, endDate, labels },
  });
  return response.data;
};

// Fetch all periods
export const fetchPeriods = async () => {
    const response = await axios.get(`${API_BASE_URL}/settings/periods`);
    return response.data;
  };
  
  // Add a new period
  export const addPeriod = async (period) => {
    const response = await axios.post(`${API_BASE_URL}/settings/periods`, period);
    return response.data;
  };

export const fetchFilters = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/settings/filters/${userId}`);
  return response.data;
};

export const saveFilters = async (userId, filters) => {
  await axios.put(`${API_BASE_URL}/settings/filters/${userId}`, filters);
};

export const fetchProjects = async () => {
    const response = await axios.get(`${API_BASE_URL}/jira/projects`);
    return response.data;
};

export const fetchLabels = async () => {
    const response = await axios.get(`${API_BASE_URL}/jira/labels`);
    return response.data;
  };


// Fetch bug trends over periods
export const fetchBugTrends = async (periods, projectKey) => {
    const response = await axios.get(`${API_BASE_URL}/insights/bug-trends`, {
      params: { periods: JSON.stringify(periods), projectKey },
    });
    return response.data.map(period => ({
      name: period.name,
      Filed: period.Filed,
      Fixed: period.Fixed,
      NL_Filed: period.NL_Filed || 0,
      NL_Fixed: period.NL_Fixed || 0,
      P0_Filed: period.P0_Filed || 0,
      P0_Fixed: period.P0_Fixed || 0,
      P1_Filed: period.P1_Filed || 0,
      P1_Fixed: period.P1_Fixed || 0,
      P2_Filed: period.P2_Filed || 0,
      P2_Fixed: period.P2_Fixed || 0,
      P3_Filed: period.P3_Filed || 0,
      P3_Fixed: period.P3_Fixed || 0,
      P4_Filed: period.P4_Filed || 0,
      P4_Fixed: period.P4_Fixed || 0,
    }));
  };
  
  // Fetch priority breakdown (Filed vs Fixed per priority)
  export const fetchPriorityBreakdown = async (periods, projectKey) => {
    const response = await axios.get(`${API_BASE_URL}/insights/priority-breakdown`, {
      params: { projectKey,  periods: JSON.stringify(periods) },
    });
    return response.data;
  };
  
  // Fetch open vs. closed bug count
  export const fetchOpenClosedBugs = async (periods, projectKey) => {
    const response = await axios.get(`${API_BASE_URL}/insights/open-closed-bugs`, {
      params: { projectKey,  periods: JSON.stringify(periods)},
    });
    return response.data;
  };
  
  // Fetch average resolution time per period
  export const fetchResolutionTime = async (periods, projectKey) => {
    const response = await axios.get(`${API_BASE_URL}/insights/resolution-time`, {
      params: { periods: JSON.stringify(periods), projectKey },
    });
    return response.data;
  };