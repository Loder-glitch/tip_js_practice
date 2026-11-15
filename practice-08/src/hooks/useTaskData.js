import { useEffect, useRef, useState } from 'react';

export function useTaskData({ api, filters }) {
  const [snapshot, setSnapshot] = useState({ tasks: [], categories: [], meta: { total: 0 } });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [pending, setPending] = useState(false);
  const [revision, setRevision] = useState(0);

  const mountedRef = useRef(false);
  const mutationControllerRef = useRef(null);

  // Признак монтирования + отмена мутации при размонтировании.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      mutationControllerRef.current?.abort();
      mutationControllerRef.current = null;
    };
  }, []);

  // Загрузка при смене фильтров или revision.
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setStatus('loading');
    setError(null);

    api.loadInitialData(
      {
        q: filters.q,
        completed: filters.completed,
        priority: filters.priority,
        categoryId: filters.categoryId,
      },
      { signal: controller.signal }
    )
      .then(data => {
        if (!active) return;
        setSnapshot(data);
        setStatus('ready');
      })
      .catch(err => {
        if (!active || controller.signal.aborted) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [api, filters.q, filters.completed, filters.priority, filters.categoryId, revision]);

  async function mutate(operation) {
    if (!mountedRef.current) return false;
    if (mutationControllerRef.current) return false;

    const controller = new AbortController();
    mutationControllerRef.current = controller;

    setPending(true);
    setMutationError(null);

    try {
      await operation({ signal: controller.signal });
      if (!mountedRef.current) return false;
      if (controller.signal.aborted) return false;
      setRevision(prev => prev + 1);
      return true;
    } catch (err) {
      if (!mountedRef.current) return false;
      if (controller.signal.aborted) return false;
      setMutationError(err);
      return false;
    } finally {
      if (mutationControllerRef.current === controller) {
        mutationControllerRef.current = null;
      }
      if (mountedRef.current) {
        setPending(false);
      }
    }
  }

  return {
    snapshot,
    status,
    error,
    mutationError,
    pending,

    refresh() {
      setRevision(prev => prev + 1);
    },

    saveTask(id, value) {
      if (id == null) {
        return mutate(({ signal }) => api.createTask(value, { signal }));
      }
      return mutate(({ signal }) => api.updateTask(id, value, { signal }));
    },

    toggleTask(task) {
      return mutate(({ signal }) =>
        api.setTaskCompleted(task.id, !task.completed, { signal })
      );
    },

    deleteTask(id) {
      return mutate(({ signal }) => api.deleteTask(id, { signal }));
    },

    resetData() {
      return mutate(({ signal }) => api.resetDemoData({ signal }));
    },
  };
}