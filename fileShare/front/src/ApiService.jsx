import axios from "axios";

let authCalls = null;
export const initAuth = () => {
  const token = localStorage.getItem("token");
  authCalls = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

initAuth();

export const signUp = (user) => {
  return authCalls.post(`/signup`, user).then((r) => {
    localStorage.setItem("token", r.data.data.token);
    localStorage.setItem("name", r.data.data.user.name);
    localStorage.setItem("email", r.data.data.user.email);
    initAuth();
    return r.data;
  });
};

export const login = (user) => {
  return authCalls.post(`/login`, user).then((r) => {
    localStorage.setItem("token", r.data.data.token);
    localStorage.setItem("name", r.data.data.user.name);
    localStorage.setItem("email", r.data.data.user.email);
    initAuth();
    return r.data;
  });
};

export const update = (user) => {
  return authCalls.patch(`/user`, user).then((r) => {
    localStorage.setItem("name", r.data.name);
    return r.data;
  });
};

export const upload = (file, progress) => {
  return authCalls.post(`/upload`, file, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      progress(percentCompleted)
    }
  }).then(r => {
    return r.data;
  })
}

export const getUploads = () => {
  return authCalls.get(`/upload`).then(r => {
    return r.data;
  })
}

export const deleteUploads = (id) => {
  return authCalls.delete(`/uploads/${id}`).then(r => {
    return r.data;
  })
}

export const downloadUploads = (id, name) => {
  return authCalls.get(`/uploads/${id}/download`, { responseType: 'blob' }) // Ensure response type is blob
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name); // Set the file name and extension as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up by revoking the blob URL
    })
    .catch(error => {
      console.error('Download error:', error);
    });
}

export const makePublic = (id) => {
  return authCalls.get(`/uploads/${id}/make_public`).then(r => {
    return r.data;
  })
}

export const makePrivate = (id) => {
  return authCalls.get(`/uploads/${id}/make_private`).then(r => {
    return r.data;
  })
}