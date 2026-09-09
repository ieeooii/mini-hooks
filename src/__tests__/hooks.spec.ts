import { render, useState, useEffect, resetHooks } from "../hooks";

describe("mini hooks test", () => {
  beforeEach(() => {
    resetHooks();
  });

  it("useState 는 초기값을 반환한다", () => {
    let seen: any;
    function Counter() {
      const [n] = useState(5);
      seen = n;
    }

    render(Counter);
    expect(seen).toBe(5);
  });

  it("render 는 컴포넌트의 반환값을 돌려준다", () => {
    function Counter() {
      const [n] = useState(3);
      return `count: ${n}`;
    }

    expect(render(Counter)).toBe("count: 3");
  });

  it("setState 하면 다시 렌더되어 최신 값이 반영된다", () => {
    let seen: any;
    let set: any;
    function Counter() {
      const [n, setN] = useState(0);
      seen = n;
      set = setN;
    }

    render(Counter);
    expect(seen).toBe(0);

    set(10);
    expect(seen).toBe(10);
  });

  it("setState 는 함수형 업데이트도 지원한다", () => {
    let seen: any;
    let set: any;
    function Counter() {
      const [n, setN] = useState(0);
      seen = n;
      set = setN;
    }

    render(Counter);
    set((prev: number) => prev + 1);
    expect(seen).toBe(1);
  });

  it("여러 useState 는 호출 순서(슬롯)대로 독립적으로 유지된다", () => {
    let vals: any = {};
    let setters: any = {};
    function Form() {
      const [a, setA] = useState("a");
      const [b, setB] = useState("b");
      vals = { a, b };
      setters = { setA, setB };
    }

    render(Form);
    expect(vals).toEqual({ a: "a", b: "b" });

    setters.setA("A"); // 첫 번째 슬롯만 바뀜
    expect(vals).toEqual({ a: "A", b: "b" });
  });

  it("useEffect 는 첫 렌더에 실행되고, deps 가 같으면 다시 실행하지 않는다", () => {
    let calls = 0;
    let set: any;
    function Counter() {
      const [n, setN] = useState(0);
      set = setN;
      useEffect(() => {
        calls += 1;
      }, [1]);
    }

    render(Counter);
    expect(calls).toBe(1);

    set(1);
    expect(calls).toBe(1);
  });

  it("useEffect 는 deps 가 바뀌면 다시 실행한다", () => {
    let calls = 0;
    let set: any;
    function Counter() {
      const [n, setN] = useState(0);
      set = setN;
      useEffect(() => {
        calls += 1;
      }, [n]); // 상태에 의존
    }

    render(Counter);
    expect(calls).toBe(1);

    set(0); // 같은 값 → deps 그대로 → 실행 안 함
    expect(calls).toBe(1);

    set(1); // n 이 바뀜 → deps 변경 → 다시 실행
    expect(calls).toBe(2);
  });
});
