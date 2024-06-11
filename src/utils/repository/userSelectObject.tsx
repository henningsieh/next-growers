export function getUserSelectObject(userId: string) {
  return {
    id: true,
    name: true,
    email: true,
    image: true,
    growerProfile: {
      select: {
        id: true,
        bio: true,
        location: true,
        headerImg: true,
        links: {
          select: {
            id: true,
            title: true,
            url: true,
          },
        },
      },
    },
    followers: {
      select: {
        followerId: true,
      },
    },
    following: {
      select: {
        followingId: true,
      },
    },
    _count: {
      select: {
        reports: { where: { authorId: userId } },
        posts: { where: { authorId: userId } },
        likes: { where: { userId: userId } },
        comments: { where: { authorId: userId } },
        cloudImages: { where: { ownerId: userId } },
      },
    },
  };
}

export function getUserSelectObjectWithoutFollow(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const {
    followers: _followers,
    following: _following,
    ...rest
  } = getUserSelectObject(userId);

  return {
    ...rest,
    _count: {
      select: {
        reports: {
          where: {
            authorId: userId,
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        },
        posts: {
          where: {
            authorId: userId,
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        },
        likes: {
          where: {
            userId: userId,
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        },
        comments: {
          where: {
            authorId: userId,
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        },
        cloudImages: {
          where: {
            ownerId: userId,
            createdAt: {
              lt: thirtyDaysAgo,
            },
          },
        },
      },
    },
  };
}
