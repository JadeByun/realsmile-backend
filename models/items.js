const JobTitles = Object.freeze({
  Manager: 'manager',
  Server: 'server',
  Cook: 'cook',
  Dishwasher: 'dishwasher',
  Cashier: 'cashier',
  Busser: 'busser',
  Bartender: 'bartender',
});

const JobTypes = Object.freeze({
  FullTime: 'fullTime',
  PartTime: 'partTime',
  Sustitue: 'substitute',
});

const Days = Object.freeze({
  Mon: 'mon',
  Tue: 'tue',
  Wed: 'wed',
  Thu: 'thu',
  Fri: 'fri',
  Sat: 'sat',
  Sun: 'sun',
});

module.exports = {
  JobTitles,
  JobTypes,
  Days,
};
