import GitInfo from 'react-git-info/macro';

const gitInfo = GitInfo();

export function useReleaseInfo() {
  return {
    isRelease:
      window.location.hostname !== 'localhost' && gitInfo.branch === 'master',
    branch: gitInfo.branch ?? '<nobranch>',
    hash: gitInfo.commit.shortHash,
    date: gitInfo.commit.date,
  };
}
