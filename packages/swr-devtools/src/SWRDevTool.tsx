import React, { useEffect, useState } from "react";
import * as CSS from "csstype";
import { CacheInterface } from "swr";


const style: CSS.Properties = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: '200px',
  opacity: 0.5,
  backgroundColor: '#EEE',
}

export const SWRDevTools = ({ cache }: { cache: CacheInterface }) => {
  const [cacheData, setCacheData] = useState<Array<{ key: string, data : object }>>([]);
  useEffect(() => {
    cache.subscribe(() => {
      // validating@{key} is a key for the validating status corresponding with the key
      // err@{key} is a key for the error that corresponding with the key
      setCacheData(cache.keys().map(key => ({ key, data: cache.get(key)})))
    })
  }, [cache]);

  return (
    <div style={style}>
      <ul>
      {cacheData.map(({ key, data }) => (
        <li key={key}>[{key}]: {JSON.stringify(data)}</li>
      ))}
      </ul>
    </div>
  )
}