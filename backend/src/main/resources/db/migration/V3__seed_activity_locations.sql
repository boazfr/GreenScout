INSERT INTO activity_location (name, description, category, location) VALUES
    ('Yarkon Park Playground',
     'Large shaded playground near the Yarkon River with swings, slides, and climbing structures.',
     'playground',
     ST_SetSRID(ST_MakePoint(34.7918, 32.0971), 4326)),

    ('Tel Aviv Botanical Garden',
     'Compact botanical garden inside the university campus with labeled plant species.',
     'garden',
     ST_SetSRID(ST_MakePoint(34.8044, 32.1133), 4326)),

    ('Hayarkon Park Nature Trail',
     'Easy 2 km walking trail along the river, great for strollers and young children.',
     'hike',
     ST_SetSRID(ST_MakePoint(34.8100, 32.1000), 4326)),

    ('Ganei Yehoshua Water Playground',
     'Seasonal water play area with fountains and splash pads for toddlers.',
     'playground',
     ST_SetSRID(ST_MakePoint(34.7985, 32.1050), 4326)),

    ('Park HaYarkon Bird Watching Area',
     'Quiet lake-side spot where families can observe herons, kingfishers and turtles.',
     'nature',
     ST_SetSRID(ST_MakePoint(34.8150, 32.1020), 4326));
