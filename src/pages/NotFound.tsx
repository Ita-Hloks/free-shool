import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Head from "../components/Head";

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate(-1);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <>
      <Head />
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          页面不存在或已被删除
        </h1>

        <div className="text-gray-500">
          <span className="mr-1">将在</span>
          <span
            key={count}
            className="inline-block text-3xl font-bold text-purple-500"
          >
            {count}
          </span>
          <span className="ml-1">秒后返回上一页</span>
        </div>
      </div>
    </>
  );
}
