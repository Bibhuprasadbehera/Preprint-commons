export const formatCitationCount = (count) => {
  if (count === 0) return '0 citations';
  if (count === 1) return '1 citation';
  if (count < 1000) return `${count} citations`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K citations`;
  return `${(count / 1000000).toFixed(1)}M citations`;
};

export const formatPublicationDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatYear = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).getFullYear().toString();
};

export const formatAuthors = (authorsArray) => {
  if (!authorsArray || authorsArray.length === 0) return 'Unknown authors';
  
  try {
    const authors = typeof authorsArray === 'string' 
      ? JSON.parse(authorsArray) 
      : authorsArray;
    
    const authorNames = authors
      .filter(author => author.author_name && author.author_name.trim())
      .map(author => author.author_name.trim());
    
    if (authorNames.length === 0) return 'Unknown authors';
    if (authorNames.length === 1) return authorNames[0];
    if (authorNames.length === 2) return `${authorNames[0]} and ${authorNames[1]}`;
    if (authorNames.length <= 3) return `${authorNames.slice(0, -1).join(', ')}, and ${authorNames[authorNames.length - 1]}`;
    
    return `${authorNames[0]} et al.`;
  } catch (error) {
    return 'Unknown authors';
  }
};