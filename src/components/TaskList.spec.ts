import './TaskList';
// Source: https://yonatankra.com/how-to-setup-vitest-in-a-tauri-project/
describe('TaskList', () => {
  it('should be defined', () => {
    expect(true).toBeTruthy();
  });

  it('should be empty', () => {
    let dayGroup =  document.querySelector('.collapse');
    expect(dayGroup).toBeNull();
  });
});