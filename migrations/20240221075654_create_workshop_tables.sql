-- Create Workshop Table
CREATE TABLE workshop_1(
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  contact TEXT NOT NULL,
  stream TEXT NOT NULL,
  year TEXT NOT NULL
);

CREATE TABLE workshop_2(
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  contact TEXT NOT NULL,
  stream TEXT NOT NULL,
  year TEXT NOT NULL
);
