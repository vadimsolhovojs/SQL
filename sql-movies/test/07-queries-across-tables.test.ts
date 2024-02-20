import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `
      SELECT full_name AS director, ROUND(SUM(m.budget_adjusted), 2) AS total_budget
      FROM movies m
      JOIN movie_directors md ON m.id = md.movie_id
      JOIN directors d ON md.director_id = d.id
      GROUP BY full_name
      ORDER BY total_budget DESC
      LIMIT 3;`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Ridley Scott",
          total_budget: 722882143.58
        },
        {
          director: "Michael Bay",
          total_budget: 518297522.1
        },
        {
          director: "David Yates",
          total_budget: 504100108.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `
      SELECT COUNT(*) as count, keyword
      FROM movies m 
      JOIN movie_keywords mk ON m.id = mk.movie_id
      JOIN keywords k ON mk.keyword_id = k.id
      GROUP BY keyword
      ORDER BY count DESC
      LIMIT 10;`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162
        },
        {
          keyword: "independent film",
          count: 115
        },
        {
          keyword: "based on novel",
          count: 85
        },
        {
          keyword: "duringcreditsstinger",
          count: 82
        },
        {
          keyword: "biography",
          count: 78
        },
        {
          keyword: "murder",
          count: 66
        },
        {
          keyword: "sex",
          count: 60
        },
        {
          keyword: "revenge",
          count: 51
        },
        {
          keyword: "sport",
          count: 50
        },
        {
          keyword: "high school",
          count: 48
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select all movies called Life and return amount of actors",
    async done => {
      const query = `
      SELECT COUNT(*) AS count, original_title
      FROM movies m
      JOIN movie_actors ma ON m.id = ma.movie_id
      JOIN actors a ON ma.actor_id = a.id
      GROUP BY original_title
      ORDER BY count DESC`;

      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `
      SELECT g.genre AS genre, COUNT(*) AS five_stars_count
      FROM movie_ratings mr
      JOIN movies m ON mr.movie_id = m.id
      JOIN movie_genres mg ON m.id = mg.movie_id
      JOIN genres g ON mg.genre_id = g.id
      WHERE mr.rating = 5
      GROUP BY g.genre
      ORDER BY five_stars_count DESC
      LIMIT 3;`;

      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052
        },
        {
          genre: "Thriller",
          five_stars_count: 11771
        },
        {
          genre: "Crime",
          five_stars_count: 8670
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `
      SELECT g.genre AS genre, ROUND(AVG(rating), 2) AS avg_rating
      FROM movie_ratings mr
      JOIN movies m ON mr.movie_id = m.id
      JOIN movie_genres mg ON m.id = mg.movie_id
      JOIN genres g ON mg.genre_id = g.id
      GROUP BY g.genre
      ORDER BY avg_rating DESC
      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79
        },
        {
          genre: "Music",
          avg_rating: 3.73
        },
        {
          genre: "Documentary",
          avg_rating: 3.71
        }
      ]);

      done();
    },
    minutes(3)
  );
});
