const Parser = require('../src/parser');

describe('Cron parser', () => {
  describe('Comma parser', () => {
    test('should print all comma separated values', () => {
      const result = Parser.parse('1,2,3,4 * * * * /folder/file');
      const { minute } = result;
      expect(minute.join(" ")).toMatch('1 2 3 4');
    });

    test('throw error for out of bound', () => {
      expect(() => {
        Parser.parse('101,2 * * * * /folder/file');
      }).toThrow(Error);
    });
  });

  describe('Range parser', () => {
    test('should print range of values', () => {
      const result = Parser.parse('1-5 * * * * /folder/file');
      const { minute } = result;
      expect(minute.join(" ")).toMatch('1 2 3 4 5');
    });

    test('if start is greater than end', () => {
      expect(() => {
        Parser.parse('4-3 * * * * /folder/file');
      }).toThrow(Error);
    });

    test('if end is less than start', () => {
      expect(() => {
        Parser.parse('6-5 * * * * /folder/file');
      }).toThrow(Error);
    });
  });

  describe('Star parser', () => {
    test('should print all values for *', () => {
      const result = Parser.parse('* * * * * /folder/file');
      const { dayOfWeek } = result;
      expect(dayOfWeek.join(" ")).toMatch('1 2 3 4 5 6 7');
    });
  });

  describe('Increment parser', () => {
    test('should print correct increment with *', () => {
      const result = Parser.parse('*/15 * * * * /folder/file');
      const { minute } = result;
      expect(minute.join(" ")).toMatch('0 15 30 45');
    });

    test('check if start is greater than max', () => {
      expect(() => {
        Parser.parse('60/15 * * * * /folder/file');
      }).toThrow(Error);
    });
  });
});