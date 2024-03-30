module.exports = {
  dateOnly: function (inputDate) {
    if (inputDate instanceof Date) {
      return inputDate != null
        ? inputDate.toISOString().split("T").shift()
        : null;
    }
    return null;
  },
  addDays: function (inputDate, days) {
    if (isNaN(days)) {
      return inputDate;
    }
    if (inputDate instanceof Date && inputDate != null) {
      inputDate.setDate(inputDate.getDate() + days);
      return inputDate;
    }
    return null;
  },
  addMonths: function (inputDate, months) {
    if (isNaN(months)) {
      return inputDate;
    }
    if (inputDate instanceof Date && inputDate != null) {
      inputDate.setMonth(inputDate.getMonth() + months);
      return inputDate;
    }
    return null;
  },
};
