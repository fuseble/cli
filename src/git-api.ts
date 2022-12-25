import axios from "axios";
import yargs from "yargs";
import chalk from "chalk";

class GitCLI {
  public static getOptions = () => {
    return yargs.usage(chalk.cyan(``)).options({
      org: {
        alias: "o",
        requiresArg: true,
      },
      repo: {
        alias: "r",
        requiresArg: true,
      },
      branch: {
        alias: "b",
        default: "main",
      },
      token: {
        alias: "t",
      },
    }).argv;
  };

  public static commits = async (options: any) => {
    const { branch, org, repo, token } = options;

    if (!org) {
      console.log(`Please provide an org`);
      process.exit(1);
    }
    if (!repo) {
      console.log(`Please provide a repo`);
      process.exit(1);
    }

    const apiClient = axios.create({ baseURL: "https://api.github.com" });
    if (token) {
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    const contributors: any[] = [];

    try {
      const url = `/repos/${org}/${repo}/stats/contributors`;
      const { data } = await apiClient.get(url, {
        headers: {
          "Cache-Control": "max-age=0",
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!Array.isArray(data)) {
        console.log(
          `Github에서 데이터를 가져올 수 없습니다. 다시 시도해주세요.`
        );
        process.exit(0);
      }

      data?.forEach((authorItem: any) => {
        const { author, total, weeks } = authorItem;
        let additions = 0;
        let deletions = 0;
        let commits = 0;

        weeks.forEach((week) => {
          const { a, d, c } = week;
          additions += a;
          deletions += d;
          commits += c;
        });

        contributors.push({
          author: author.login,
          total,
          additions,
          deletions,
          commits,
        });
      });

      const logins = contributors.map((item) => item.author);
      const total = contributors.reduce((acc, item) => acc + item.total, 0);
      const additions = contributors.reduce(
        (acc, item) => acc + item.additions,
        0
      );
      const deletions = contributors.reduce(
        (acc, item) => acc + item.deletions,
        0
      );
      const commits = contributors.reduce((acc, item) => acc + item.commits, 0);

      console.log(chalk.cyan("[Summary]"));
      console.log(`Contributors: ${logins.join(", ")}`);
      console.log(`Total: ${total}`);
      console.log(`Additions: ${additions}`);
      console.log(`Deletions: ${deletions}`);
      console.log(`Commits: ${commits}`);
      console.log();
      console.log(chalk.red("[Contributors]"));

      contributors.forEach((contributor) => {
        const { author, total, additions, deletions, commits } = contributor;
        console.log(
          ` - ${chalk.red(
            author
          )} : ${total} Commits (${additions} additions, ${deletions} deletions, ${commits} commits)`
        );
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
}

export default GitCLI;
