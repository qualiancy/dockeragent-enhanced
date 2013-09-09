module.exports = process.env.enhanced_COV
  ? require('./lib-cov/enhanced')
  : require('./lib/enhanced');
