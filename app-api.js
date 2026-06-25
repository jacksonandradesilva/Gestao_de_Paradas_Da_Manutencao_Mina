(function () {
  const STORAGE_KEY = 'mina_manutencao_state_v1';
  const EMPTY_STATE = {
    equipamentos: [],
    historicoParadas: []
  };

  let memoryState = {
    equipamentos: [],
    historicoParadas: []
  };

  function normalizeState(state) {
    const safeState = state && typeof state === 'object' ? state : EMPTY_STATE;

    return {
      equipamentos: Array.isArray(safeState.equipamentos) ? safeState.equipamentos : [],
      historicoParadas: Array.isArray(safeState.historicoParadas) ? safeState.historicoParadas : []
    };
  }

  function canUseLocalStorage() {
    try {
      if (!window.localStorage) {
        return false;
      }

      const testKey = STORAGE_KEY + '_test';
      window.localStorage.setItem(testKey, 'ok');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getStateFromLocal() {
    if (!canUseLocalStorage()) {
      return normalizeState(memoryState);
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        const empty = normalizeState(EMPTY_STATE);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
        return empty;
      }

      return normalizeState(JSON.parse(raw));
    } catch (error) {
      return normalizeState(EMPTY_STATE);
    }
  }

  function saveStateToLocal(nextState) {
    const normalized = normalizeState(nextState);

    if (canUseLocalStorage()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }

    memoryState = normalized;
    return normalized;
  }

  async function getState() {
    return getStateFromLocal();
  }

  async function saveState(nextState) {
    return saveStateToLocal(nextState);
  }

  async function saveEquipamentos(equipamentos) {
    const currentState = await getState();
    return saveState({
      ...currentState,
      equipamentos
    });
  }

  async function saveHistoricoParadas(historicoParadas) {
    const currentState = await getState();
    return saveState({
      ...currentState,
      historicoParadas
    });
  }

  async function exportStateJSON() {
    const currentState = await getState();
    return JSON.stringify(currentState, null, 2);
  }

  async function clearState() {
    return saveState(EMPTY_STATE);
  }

  window.serverStore = {
    getState,
    saveState,
    saveEquipamentos,
    saveHistoricoParadas,
    exportStateJSON,
    clearState
  };
})();