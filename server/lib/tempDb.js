// Temporary in-memory storage for users (for testing without MongoDB)
export const tempUsers = [];

export const findUserByEmail = (email) => {
    return tempUsers.find(user => user.email === email);
};

export const createUser = (userData) => {
    const newUser = {
        _id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
    };
    tempUsers.push(newUser);
    return newUser;
};

export const findUserById = (id) => {
    return tempUsers.find(user => user._id === id);
};
